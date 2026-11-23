"""
Permission Routes - Permission Requests
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.permission_controller import (
    create_permission_request,
    get_my_permissions,
    get_pending_permissions,
    approve_permission,
    reject_permission,
)
from utils.db import get_db

permission_bp = Blueprint(
    'permission',
    __name__,
    url_prefix='/api/permission'
)

@permission_bp.route('/request', methods=['POST'])
@jwt_required()
def create_permission():
    db = get_db()
    return create_permission_request(db)

@permission_bp.route('/my-permissions', methods=['GET'])
@jwt_required()
def my_permissions():
    db = get_db()
    return get_my_permissions(db)

@permission_bp.route('/pending', methods=['GET'])
@jwt_required()
def pending_permissions():
    db = get_db()
    return get_pending_permissions(db)

@permission_bp.route('/<permission_id>/approve', methods=['POST'])
@jwt_required()
def approve_permission_request(permission_id):
    db = get_db()
    return approve_permission(db, permission_id)

@permission_bp.route('/<permission_id>/reject', methods=['POST'])
@jwt_required()
def reject_permission_request(permission_id):
    db = get_db()
    return reject_permission(db, permission_id)
