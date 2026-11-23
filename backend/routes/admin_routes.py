"""
Admin Routes - Admin Operations
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.admin_controller import (
    get_all_employees,
    create_employee,
    update_employee_role,
    deactivate_employee,
    get_attendance_analytics,
    get_monthly_report,
    get_company_details,
    update_company_details,
)
from utils.db import get_db

admin_bp = Blueprint(
    'admin',
    __name__,
    url_prefix='/api/admin'
)

@admin_bp.route('/employees', methods=['GET'])
@jwt_required()
def all_employees():
    db = get_db()
    return get_all_employees(db)

@admin_bp.route('/employee/create', methods=['POST'])
@jwt_required()
def create_emp():
    db = get_db()
    return create_employee(db)

@admin_bp.route('/employee/<user_id>/role', methods=['PUT'])
@jwt_required()
def update_role(user_id):
    db = get_db()
    return update_employee_role(db, user_id)

@admin_bp.route('/employee/<user_id>/deactivate', methods=['POST'])
@jwt_required()
def deactivate_emp(user_id):
    db = get_db()
    return deactivate_employee(db, user_id)

@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def analytics():
    db = get_db()
    return get_attendance_analytics(db)

@admin_bp.route('/monthly-report', methods=['GET'])
@jwt_required()
def monthly_report():
    db = get_db()
    return get_monthly_report(db)

@admin_bp.route('/company', methods=['GET'])
@jwt_required()
def company_details():
    db = get_db()
    return get_company_details(db)

@admin_bp.route('/company', methods=['PUT'])
@jwt_required()
def update_company():
    db = get_db()
    return update_company_details(db)
