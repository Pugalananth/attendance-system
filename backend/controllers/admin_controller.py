"""
Admin Controller - Admin Operations
"""

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from datetime import datetime, timedelta
from models.user_model_new import serialize_user, create_user_doc

def get_all_employees(db):
    """Get all employees with filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        role = request.args.get('role', 'employee')
        department = request.args.get('department')
        
        query = {"role": role}
        if department:
            query["department"] = department
        
        total = db.users.count_documents(query)
        
        users = list(db.users.find(query)
            .skip((page - 1) * limit)
            .limit(limit))
        
        return jsonify({
            "total": total,
            "page": page,
            "limit": limit,
            "users": [serialize_user(u) for u in users],
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_employee(db):
    """Create new employee - Admin only"""
    try:
        data = request.get_json()
        
        required = ['name', 'email', 'role']
        if not all(field in data for field in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Check if email exists
        existing = db.users.find_one({"email": data['email'].lower()})
        if existing:
            return jsonify({"error": "Email already exists"}), 409
        
        # Create default password
        password = data.get('password', 'DefaultPass@123')
        
        user_doc = create_user_doc(
            name=data['name'],
            email=data['email'],
            password=password,
            role=data.get('role', 'employee'),
            employee_id=data.get('employee_id'),
            department=data.get('department', ''),
            phone=data.get('phone', ''),
            team_id=data.get('team_id'),
        )
        
        result = db.users.insert_one(user_doc)
        user_doc['_id'] = ObjectId(result.inserted_id)
        
        return jsonify({
            "message": "Employee created successfully",
            "user": serialize_user(user_doc),
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_employee_role(db, user_id):
    """Update employee role"""
    try:
        data = request.get_json()
        
        if 'role' not in data:
            return jsonify({"error": "Role is required"}), 400
        
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "role": data['role'],
                "updated_at": datetime.utcnow(),
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
        
        user = db.users.find_one({"_id": ObjectId(user_id)})
        
        return jsonify({
            "message": "Role updated successfully",
            "user": serialize_user(user),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def deactivate_employee(db, user_id):
    """Deactivate employee"""
    try:
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "status": "inactive",
                "updated_at": datetime.utcnow(),
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
        
        user = db.users.find_one({"_id": ObjectId(user_id)})
        
        return jsonify({
            "message": "Employee deactivated successfully",
            "user": serialize_user(user),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_attendance_analytics(db):
    """Get attendance analytics"""
    try:
        period = request.args.get('period', 'monthly')  # daily, weekly, monthly
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date or not end_date:
            return jsonify({"error": "start_date and end_date are required"}), 400
        
        # Build query
        query = {
            "date": {"$gte": start_date, "$lte": end_date},
            "check_type": "check_in"
        }
        
        # Get attendance data
        attendance_data = list(db.attendance.find(query))
        
        # Calculate analytics
        total_days = db.attendance.count_documents(query)
        total_employees = len(set(a['user_id'] for a in attendance_data))
        
        return jsonify({
            "period": period,
            "start_date": start_date,
            "end_date": end_date,
            "total_check_ins": total_days,
            "total_unique_employees": total_employees,
            "average_attendance": round((total_days / (total_employees * ((datetime.strptime(end_date, "%Y-%m-%d") - datetime.strptime(start_date, "%Y-%m-%d")).days + 1))) * 100, 2) if total_employees > 0 else 0,
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_monthly_report(db):
    """Get monthly attendance report"""
    try:
        year = request.args.get('year', datetime.utcnow().year, type=int)
        month = request.args.get('month', datetime.utcnow().month, type=int)
        
        # Get all attendance records for the month
        start_date = f"{year}-{month:02d}-01"
        
        if month == 12:
            end_date = f"{year+1}-01-01"
        else:
            end_date = f"{year}-{month+1:02d}-01"
        
        query = {
            "date": {"$gte": start_date, "$lt": end_date},
            "check_type": "check_in"
        }
        
        records = list(db.attendance.find(query).sort("date", 1))
        
        # Group by employee
        employee_attendance = {}
        for record in records:
            employee_id = record['employee_id']
            if employee_id not in employee_attendance:
                employee_attendance[employee_id] = {
                    "name": record.get('name'),
                    "employee_id": employee_id,
                    "days": 0,
                }
            employee_attendance[employee_id]["days"] += 1
        
        return jsonify({
            "year": year,
            "month": month,
            "report": list(employee_attendance.values()),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_company_details(db):
    """Get company details"""
    try:
        company = db.company.find_one({})
        
        if not company:
            return jsonify({"error": "Company details not found"}), 404
        
        return jsonify({
            "id": str(company["_id"]),
            "name": company.get("name"),
            "email": company.get("email"),
            "phone": company.get("phone"),
            "address": company.get("address"),
            "city": company.get("city"),
            "country": company.get("country"),
            "logo_url": company.get("logo_url"),
            "working_hours_start": company.get("working_hours_start"),
            "working_hours_end": company.get("working_hours_end"),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_company_details(db):
    """Update company details"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Only admin can update
        user = db.users.find_one({"_id": ObjectId(current_user_id)})
        if user.get('role') != 'admin':
            return jsonify({"error": "Unauthorized"}), 403
        
        updatable = ['name', 'email', 'phone', 'address', 'city', 'country', 
                     'working_hours_start', 'working_hours_end']
        update_data = {k: v for k, v in data.items() if k in updatable}
        update_data['updated_at'] = datetime.utcnow()
        
        result = db.company.update_one(
            {},
            {"$set": update_data},
            upsert=True
        )
        
        company = db.company.find_one({})
        
        return jsonify({
            "message": "Company details updated",
            "company": {
                "id": str(company["_id"]),
                "name": company.get("name"),
                "email": company.get("email"),
                "phone": company.get("phone"),
            },
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
