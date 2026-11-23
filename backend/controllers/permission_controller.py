"""
Permission Controller - Permission Requests
"""

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from datetime import datetime
from models.permission_model import (
    create_permission_doc,
    serialize_permission,
)

def create_permission_request(db):
    """Create permission request"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        required = ['permission_type', 'start_time', 'end_time']
        if not all(field in data for field in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        user = db.users.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        permission_doc = create_permission_doc(
            user_id=ObjectId(current_user_id),
            employee_id=user['employee_id'],
            name=user['name'],
            permission_type=data['permission_type'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            reason=data.get('reason', ''),
            status='pending',
        )
        
        result = db.permissions.insert_one(permission_doc)
        permission_doc['_id'] = ObjectId(result.inserted_id)
        
        return jsonify({
            "message": "Permission request created successfully",
            "permission": serialize_permission(permission_doc),
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_my_permissions(db):
    """Get user's permission requests"""
    try:
        current_user_id = get_jwt_identity()
        
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        status = request.args.get('status')
        
        query = {"user_id": ObjectId(current_user_id)}
        if status:
            query["status"] = status
        
        total = db.permissions.count_documents(query)
        
        permissions = list(db.permissions.find(query)
            .sort("created_at", -1)
            .skip((page - 1) * limit)
            .limit(limit))
        
        return jsonify({
            "total": total,
            "page": page,
            "limit": limit,
            "permissions": [serialize_permission(p) for p in permissions],
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_pending_permissions(db):
    """Get all pending permission requests"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        query = {"status": "pending"}
        
        total = db.permissions.count_documents(query)
        
        permissions = list(db.permissions.find(query)
            .sort("created_at", -1)
            .skip((page - 1) * limit)
            .limit(limit))
        
        return jsonify({
            "total": total,
            "page": page,
            "limit": limit,
            "permissions": [serialize_permission(p) for p in permissions],
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def approve_permission(db, permission_id):
    """Approve permission request"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        result = db.permissions.update_one(
            {"_id": ObjectId(permission_id)},
            {"$set": {
                "status": "approved",
                "approved_by": ObjectId(current_user_id),
                "approval_date": datetime.utcnow(),
                "remarks": data.get('remarks', ''),
                "updated_at": datetime.utcnow(),
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Permission request not found"}), 404
        
        permission = db.permissions.find_one({"_id": ObjectId(permission_id)})
        
        return jsonify({
            "message": "Permission request approved",
            "permission": serialize_permission(permission),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def reject_permission(db, permission_id):
    """Reject permission request"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        result = db.permissions.update_one(
            {"_id": ObjectId(permission_id)},
            {"$set": {
                "status": "rejected",
                "approved_by": ObjectId(current_user_id),
                "approval_date": datetime.utcnow(),
                "remarks": data.get('remarks', ''),
                "updated_at": datetime.utcnow(),
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Permission request not found"}), 404
        
        permission = db.permissions.find_one({"_id": ObjectId(permission_id)})
        
        return jsonify({
            "message": "Permission request rejected",
            "permission": serialize_permission(permission),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
