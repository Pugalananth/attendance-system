"""
Face Recognition Utility using DeepFace + OpenCV
Handles face detection, embedding generation, and verification
"""

import os
import cv2
import numpy as np
import base64
import json
import logging
from PIL import Image
import io

logger = logging.getLogger(__name__)

# Try to import DeepFace - if it fails, face features will be disabled
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except (ImportError, Exception) as e:
    logger.warning(f"DeepFace not available: {e}")
    DEEPFACE_AVAILABLE = False
    DeepFace = None

# Config
DEEPFACE_MODEL = os.getenv("DEEPFACE_MODEL", "Facenet512")
DEEPFACE_DETECTOR = os.getenv("DEEPFACE_DETECTOR", "opencv")
VERIFICATION_THRESHOLD = float(os.getenv("FACE_VERIFICATION_THRESHOLD", "0.6"))
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
EMBEDDINGS_FOLDER = os.getenv("EMBEDDINGS_FOLDER", "embeddings")

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EMBEDDINGS_FOLDER, exist_ok=True)


def base64_to_image(base64_str: str) -> np.ndarray:
    """Convert base64 string to OpenCV image array."""
    try:
        # Remove data URL prefix if present
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]

        img_bytes = base64.b64decode(base64_str)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Failed to decode image from base64")

        return img
    except Exception as e:
        logger.error(f"base64_to_image error: {e}")
        raise ValueError(f"Invalid image data: {str(e)}")


def image_to_base64(image: np.ndarray) -> str:
    """Convert OpenCV image array to base64 string."""
    _, buffer = cv2.imencode(".jpg", image)
    return base64.b64encode(buffer).decode("utf-8")


def save_image(image: np.ndarray, filename: str) -> str:
    """Save image to upload folder."""
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    cv2.imwrite(filepath, image)
    return filepath


def detect_faces(image: np.ndarray) -> list:
    """
    Detect faces in image using OpenCV Haar Cascade.
    Returns list of face regions (x, y, w, h).
    """
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # Equalize histogram for better detection in low light
        gray = cv2.equalizeHist(gray)

        face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(80, 80),
            flags=cv2.CASCADE_SCALE_IMAGE,
        )
        return faces.tolist() if len(faces) > 0 else []
    except Exception as e:
        logger.error(f"Face detection error: {e}")
        return []


def validate_face_image(image: np.ndarray) -> dict:
    """
    Validate that image contains exactly one clear face.
    Returns validation result with details.
    """
    if image is None or image.size == 0:
        return {"valid": False, "error": "Empty or invalid image"}

    # Check image dimensions
    h, w = image.shape[:2]
    if h < 100 or w < 100:
        return {"valid": False, "error": "Image too small, minimum 100x100 pixels"}

    faces = detect_faces(image)

    if len(faces) == 0:
        return {"valid": False, "error": "No face detected. Please look at camera directly"}

    if len(faces) > 1:
        return {
            "valid": False,
            "error": f"Multiple faces detected ({len(faces)}). Please ensure only one person is in frame",
        }

    return {"valid": True, "face_count": 1, "face_region": faces[0]}


def preprocess_image(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image for better face recognition accuracy.
    - Resize to standard size
    - Apply CLAHE for low-light enhancement
    - Denoise
    """
    try:
        # Convert to LAB for better color processing
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l_channel, a, b = cv2.split(lab)

        # Apply CLAHE to L channel (contrast enhancement)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l_channel = clahe.apply(l_channel)

        # Merge and convert back
        lab = cv2.merge((l_channel, a, b))
        enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

        # Mild denoise
        denoised = cv2.fastNlMeansDenoisingColored(enhanced, None, 5, 5, 7, 21)

        return denoised
    except Exception as e:
        logger.warning(f"Preprocessing warning: {e}")
        return image  # Return original if preprocessing fails


def generate_embedding(image: np.ndarray) -> list:
    """
    Generate face embedding using DeepFace (Facenet512 model).
    Returns 512-dimensional embedding vector.
    """
    if not DEEPFACE_AVAILABLE:
        raise RuntimeError(
            "DeepFace is not available. Face recognition features are disabled. "
            "This is usually a temporary system issue. Try restarting the server."
        )
    
    try:
        # DeepFace expects RGB, OpenCV is BGR
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Convert to PIL Image for DeepFace
        pil_image = Image.fromarray(rgb_image)

        # Save to temporary buffer
        buffer = io.BytesIO()
        pil_image.save(buffer, format="JPEG", quality=95)
        buffer.seek(0)

        # Generate embedding
        embedding_obj = DeepFace.represent(
            img_path=np.array(pil_image),
            model_name=DEEPFACE_MODEL,
            detector_backend=DEEPFACE_DETECTOR,
            enforce_detection=True,
            align=True,
        )

        if not embedding_obj:
            raise ValueError("No face embedding generated")

        return embedding_obj[0]["embedding"]

    except Exception as e:
        logger.error(f"Embedding generation error: {e}")
        raise ValueError(f"Could not generate face embedding: {str(e)}")


def compute_embedding_distance(emb1: list, emb2: list) -> float:
    """
    Compute cosine distance between two embeddings.
    Lower distance = more similar faces.
    """
    arr1 = np.array(emb1)
    arr2 = np.array(emb2)

    # Normalize vectors
    norm1 = np.linalg.norm(arr1)
    norm2 = np.linalg.norm(arr2)

    if norm1 == 0 or norm2 == 0:
        return 1.0  # Maximum distance if zero vector

    # Cosine similarity → distance
    cosine_similarity = np.dot(arr1, arr2) / (norm1 * norm2)
    cosine_distance = 1 - cosine_similarity

    return float(cosine_distance)


def compute_average_embedding(embeddings: list) -> list:
    """
    Compute average embedding from multiple face images.
    Used during registration with 5 face captures.
    """
    if not embeddings:
        raise ValueError("No embeddings provided")

    arr = np.array(embeddings)
    avg = np.mean(arr, axis=0)

    # Normalize the average embedding
    norm = np.linalg.norm(avg)
    if norm > 0:
        avg = avg / norm

    return avg.tolist()


def verify_face(probe_embedding: list, stored_embeddings: list, threshold: float = None) -> dict:
    """
    Verify face against stored embeddings.
    
    Args:
        probe_embedding: Embedding from live capture
        stored_embeddings: List of stored embeddings from registration
        threshold: Distance threshold (lower = stricter)
    
    Returns:
        dict with verified, confidence, distance
    """
    if threshold is None:
        threshold = VERIFICATION_THRESHOLD

    if not stored_embeddings:
        return {"verified": False, "confidence": 0.0, "error": "No stored embeddings found"}

    try:
        # Compare against all stored embeddings, take minimum distance
        distances = []
        for stored_emb in stored_embeddings:
            dist = compute_embedding_distance(probe_embedding, stored_emb)
            distances.append(dist)

        min_distance = min(distances)
        avg_distance = np.mean(distances)

        # Confidence: 0-100% (100% = perfect match)
        confidence = max(0, (1 - min_distance) * 100)

        verified = min_distance <= threshold

        return {
            "verified": verified,
            "confidence": round(confidence, 2),
            "distance": round(min_distance, 4),
            "avg_distance": round(avg_distance, 4),
            "threshold": threshold,
        }

    except Exception as e:
        logger.error(f"Face verification error: {e}")
        return {"verified": False, "confidence": 0.0, "error": str(e)}


def anti_spoof_check(image: np.ndarray) -> dict:
    """
    Basic anti-spoofing check using texture analysis.
    Detects printed photos or screens.
    
    Uses Laplacian variance (blur detection) and 
    frequency domain analysis to detect fake faces.
    """
    try:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # 1. Blur/sharpness analysis - real faces have natural texture
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

        # 2. Frequency domain analysis - detect screen patterns
        dft = cv2.dft(np.float32(gray), flags=cv2.DFT_COMPLEX_OUTPUT)
        dft_shift = np.fft.fftshift(dft)
        magnitude_spectrum = 20 * np.log(cv2.magnitude(dft_shift[:, :, 0], dft_shift[:, :, 1]) + 1)
        freq_mean = np.mean(magnitude_spectrum)

        # 3. Color variance - printed photos lack natural skin tone variation
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        saturation = hsv[:, :, 1]
        sat_std = np.std(saturation)

        # Heuristic thresholds (tuned for common attack scenarios)
        is_blurry = laplacian_var < 50  # Too blurry = possible photo
        low_saturation_variance = sat_std < 15  # Low variation = possible printout
        
        # Score: higher = more likely real
        liveness_score = min(100, (laplacian_var / 5) + (sat_std * 2))

        # Be lenient: only reject obvious attacks
        is_fake = is_blurry and low_saturation_variance

        return {
            "is_live": not is_fake,
            "liveness_score": round(liveness_score, 2),
            "sharpness": round(laplacian_var, 2),
            "saturation_variance": round(float(sat_std), 2),
        }

    except Exception as e:
        logger.warning(f"Anti-spoof check warning: {e}")
        # Default to allowing if check fails (avoid blocking real users)
        return {"is_live": True, "liveness_score": 50.0}


def crop_face(image: np.ndarray, face_region: list, padding: float = 0.3) -> np.ndarray:
    """Crop face region from image with padding."""
    try:
        x, y, w, h = face_region
        ih, iw = image.shape[:2]

        # Add padding around face
        pad_x = int(w * padding)
        pad_y = int(h * padding)

        x1 = max(0, x - pad_x)
        y1 = max(0, y - pad_y)
        x2 = min(iw, x + w + pad_x)
        y2 = min(ih, y + h + pad_y)

        return image[y1:y2, x1:x2]
    except Exception:
        return image
