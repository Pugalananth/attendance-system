"""
Face Recognition Controller
Handles face registration and verification using DeepFace
"""

import os
import uuid
from datetime import datetime, timezone
from flask import request, jsonify
from bson import ObjectId
import logging
import numpy as np

from utils.db import get_db
from utils.face_utils import (
    base64_to_image,
    validate_face_image,
    preprocess_image,
    generate_embedding,
    compute_average_embedding,
    verify_face,
    anti_spoof_check,
    save_image,
    image_to_base64,
)
from models.face_model import create_face_doc, serialize_face

logger = logging.getLogger(__name__)

MIN_REGISTRATION_IMAGES = 3   # Minimum images required for registration
MAX_REGISTRATION_IMAGES = 5   # Maximum images to use


def register_face():
    """
    POST /api/face/register
    Register face for a student using multiple captured images.
    
    Request body:
    {
        "student_id": "STU001",
        "images": ["base64_img1", "base64_img2", ...],  // 3-5 images
        "user_id": "mongodb_object_id"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Request body required"}), 400

        student_id = data.get("student_id", "").strip()
        images_b64 = data.get("images", [])
        user_id = data.get("user_id", "").strip()

        # Use token user_id if not provided
        if not user_id:
            user_id = request.current_user.get("user_id", "")

        # Validate inputs
        if not student_id:
            return jsonify({"success": False, "message": "Student ID required"}), 400

        if len(images_b64) < MIN_REGISTRATION_IMAGES:
            return jsonify({
                "success": False,
                "message": f"Minimum {MIN_REGISTRATION_IMAGES} face images required for accurate registration",
            }), 400

        # Limit to max images
        images_b64 = images_b64[:MAX_REGISTRATION_IMAGES]

        db = get_db()

        # Verify user exists
        try:
            obj_id = ObjectId(user_id)
        except Exception:
            return jsonify({"success": False, "message": "Invalid user ID"}), 400

        user = db["users"].find_one({"_id": obj_id})
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Process each image
        embeddings = []
        saved_paths = []
        failed_images = []

        for idx, img_b64 in enumerate(images_b64):
            try:
                # Decode base64 to image
                image = base64_to_image(img_b64)

                # Validate face
                validation = validate_face_image(image)
                if not validation["valid"]:
                    failed_images.append(f"Image {idx + 1}: {validation['error']}")
                    continue

                # Anti-spoof check
                liveness = anti_spoof_check(image)
                if not liveness["is_live"]:
                    failed_images.append(f"Image {idx + 1}: Fake face detected (liveness check failed)")
                    continue

                # Preprocess image
                processed = preprocess_image(image)

                # Generate embedding
                embedding = generate_embedding(processed)
                embeddings.append(embedding)

                # Save image to disk
                filename = f"{student_id}_{idx}_{uuid.uuid4().hex[:8]}.jpg"
                path = save_image(processed, filename)
                saved_paths.append(path)

            except ValueError as ve:
                failed_images.append(f"Image {idx + 1}: {str(ve)}")
                continue
            except Exception as e:
                logger.error(f"Image {idx + 1} processing error: {e}")
                failed_images.append(f"Image {idx + 1}: Processing failed")
                continue

        # Check if enough valid embeddings were generated
        if len(embeddings) < MIN_REGISTRATION_IMAGES:
            return jsonify({
                "success": False,
                "message": f"Only {len(embeddings)} valid face images processed. Need at least {MIN_REGISTRATION_IMAGES}.",
                "errors": failed_images,
            }), 400

        # Compute average embedding for faster comparison
        avg_embedding = compute_average_embedding(embeddings)

        # Remove existing face data if any
        db["faces"].delete_one({"student_id": student_id})

        # Create face document
        face_doc = create_face_doc(
            user_id=str(user_id),
            student_id=student_id,
            embeddings=embeddings,
            image_paths=saved_paths,
        )
        face_doc["avg_embedding"] = avg_embedding

        # Save to database
        db["faces"].insert_one(face_doc)

        # Update user's face_registered flag
        db["users"].update_one(
            {"_id": obj_id},
            {"$set": {"face_registered": True, "updated_at": datetime.now(timezone.utc)}},
        )

        logger.info(f"✅ Face registered for student {student_id} with {len(embeddings)} images")

        return jsonify({
            "success": True,
            "message": f"Face registered successfully with {len(embeddings)} images",
            "data": {
                "face": serialize_face(face_doc),
                "images_processed": len(embeddings),
                "warnings": failed_images if failed_images else None,
            },
        }), 201

    except Exception as e:
        logger.error(f"Face registration error: {e}")
        return jsonify({"success": False, "message": f"Face registration failed: {str(e)}"}), 500


def verify_face_endpoint():
    """
    POST /api/face/verify
    Verify a face image against a student's registered face.
    
    Request body:
    {
        "student_id": "STU001",  // optional - if not provided, searches all
        "image": "base64_image_string"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Request body required"}), 400

        image_b64 = data.get("image", "")
        student_id = data.get("student_id", "").strip()

        if not image_b64:
            return jsonify({"success": False, "message": "Face image required"}), 400

        # Decode image
        try:
            image = base64_to_image(image_b64)
        except ValueError as e:
            return jsonify({"success": False, "message": str(e)}), 400

        # Validate face
        validation = validate_face_image(image)
        if not validation["valid"]:
            return jsonify({
                "success": False,
                "message": validation["error"],
                "verified": False,
            }), 400

        # Anti-spoof check
        liveness = anti_spoof_check(image)
        if not liveness["is_live"]:
            return jsonify({
                "success": False,
                "message": "Liveness check failed. Please use your real face",
                "verified": False,
                "liveness_score": liveness.get("liveness_score", 0),
            }), 400

        # Preprocess image
        processed = preprocess_image(image)

        # Generate probe embedding
        try:
            probe_embedding = generate_embedding(processed)
        except ValueError as e:
            return jsonify({
                "success": False,
                "message": str(e),
                "verified": False,
            }), 400

        db = get_db()

        # Search for matching student
        if student_id:
            # Verify against specific student
            face_doc = db["faces"].find_one({"student_id": student_id, "is_active": True})
            if not face_doc:
                return jsonify({
                    "success": False,
                    "message": "No registered face found for this student",
                    "verified": False,
                }), 404

            result = verify_face(probe_embedding, face_doc["embeddings"])

            if result.get("error") and not result["verified"]:
                return jsonify({
                    "success": False,
                    "message": result["error"],
                    "verified": False,
                }), 400

            if not result["verified"]:
                return jsonify({
                    "success": True,
                    "verified": False,
                    "message": "Face verification failed. Identity not matched",
                    "confidence": result["confidence"],
                }), 200

            # Get user details
            user = db["users"].find_one({"student_id": student_id, "is_active": True})
            from models.user_model import serialize_user

            return jsonify({
                "success": True,
                "verified": True,
                "message": "Identity verified successfully",
                "data": {
                    "student": serialize_user(user) if user else None,
                    "confidence": result["confidence"],
                    "distance": result["distance"],
                    "liveness_score": liveness.get("liveness_score", 100),
                },
            }), 200

        else:
            # Search all registered faces (1:N matching)
            all_faces = list(db["faces"].find({"is_active": True}))

            if not all_faces:
                return jsonify({
                    "success": False,
                    "message": "No registered faces in system",
                    "verified": False,
                }), 404

            best_match = None
            best_distance = float("inf")
            best_confidence = 0

            for face_doc in all_faces:
                result = verify_face(probe_embedding, face_doc["embeddings"])
                if result["verified"] and result["distance"] < best_distance:
                    best_distance = result["distance"]
                    best_confidence = result["confidence"]
                    best_match = face_doc

            if not best_match:
                return jsonify({
                    "success": True,
                    "verified": False,
                    "message": "No matching student found",
                }), 200

            user = db["users"].find_one(
                {"student_id": best_match["student_id"], "is_active": True}
            )
            from models.user_model import serialize_user

            return jsonify({
                "success": True,
                "verified": True,
                "message": "Identity verified",
                "data": {
                    "student": serialize_user(user) if user else None,
                    "confidence": best_confidence,
                    "distance": round(best_distance, 4),
                    "liveness_score": liveness.get("liveness_score", 100),
                },
            }), 200

    except Exception as e:
        logger.error(f"Face verification error: {e}")
        return jsonify({"success": False, "message": f"Verification failed: {str(e)}"}), 500


def get_face_status():
    """
    GET /api/face/status/:student_id
    Check if a student has registered face data.
    """
    try:
        student_id = request.view_args.get("student_id")
        db = get_db()

        face_doc = db["faces"].find_one({"student_id": student_id, "is_active": True})

        return jsonify({
            "success": True,
            "data": {
                "registered": face_doc is not None,
                "face": serialize_face(face_doc) if face_doc else None,
            },
        }), 200

    except Exception as e:
        logger.error(f"Face status error: {e}")
        return jsonify({"success": False, "message": "Failed to check face status"}), 500


def delete_face():
    """
    DELETE /api/face/delete/:student_id
    Delete face registration for a student.
    """
    try:
        student_id = request.view_args.get("student_id")
        db = get_db()

        result = db["faces"].update_one(
            {"student_id": student_id},
            {"$set": {"is_active": False}},
        )

        if result.matched_count == 0:
            return jsonify({"success": False, "message": "Face data not found"}), 404

        # Update user flag
        db["users"].update_one(
            {"student_id": student_id},
            {"$set": {"face_registered": False, "updated_at": datetime.now(timezone.utc)}},
        )

        return jsonify({
            "success": True,
            "message": "Face registration deleted successfully",
        }), 200

    except Exception as e:
        logger.error(f"Delete face error: {e}")
        return jsonify({"success": False, "message": "Failed to delete face data"}), 500
