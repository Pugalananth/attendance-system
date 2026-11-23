"""
Team Controller - Team Management
"""

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from datetime import datetime
from models.team_model import (
    create_team_doc,
    serialize_team,
)

def create_team(db):
    """Create new team - HR or Admin only"""
    try:
        data = request.get_json()
        
        required = ['name', 'team_leader_id']
        if not all(field in data for field in required):
            return jsonify({"error": "Missing required fields"}), 400
        
        team_doc = create_team_doc(
            name=data['name'],
            team_leader_id=ObjectId(data['team_leader_id']),
            department=data.get('department', ''),
            description=data.get('description', ''),
        )
        
        result = db.teams.insert_one(team_doc)
        team_doc['_id'] = ObjectId(result.inserted_id)
        
        return jsonify({
            "message": "Team created successfully",
            "team": serialize_team(team_doc),
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def add_team_member(db, team_id):
    """Add member to team"""
    try:
        data = request.get_json()
        
        if 'employee_id' not in data:
            return jsonify({"error": "employee_id is required"}), 400
        
        # Check if team exists
        team = db.teams.find_one({"_id": ObjectId(team_id)})
        if not team:
            return jsonify({"error": "Team not found"}), 404
        
        # Add member
        db.teams.update_one(
            {"_id": ObjectId(team_id)},
            {"$addToSet": {"members": data['employee_id']}}
        )
        
        # Update user's team_id
        db.users.update_one(
            {"employee_id": data['employee_id']},
            {"$set": {"team_id": ObjectId(team_id)}}
        )
        
        team = db.teams.find_one({"_id": ObjectId(team_id)})
        
        return jsonify({
            "message": "Team member added",
            "team": serialize_team(team),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def remove_team_member(db, team_id):
    """Remove member from team"""
    try:
        data = request.get_json()
        
        if 'employee_id' not in data:
            return jsonify({"error": "employee_id is required"}), 400
        
        # Remove member
        db.teams.update_one(
            {"_id": ObjectId(team_id)},
            {"$pull": {"members": data['employee_id']}}
        )
        
        # Update user's team_id
        db.users.update_one(
            {"employee_id": data['employee_id']},
            {"$unset": {"team_id": ""}}
        )
        
        team = db.teams.find_one({"_id": ObjectId(team_id)})
        
        return jsonify({
            "message": "Team member removed",
            "team": serialize_team(team),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_team_members(db, team_id):
    """Get all members of a team"""
    try:
        team = db.teams.find_one({"_id": ObjectId(team_id)})
        if not team:
            return jsonify({"error": "Team not found"}), 404
        
        # Get member details
        members = []
        for emp_id in team.get('members', []):
            member = db.users.find_one({"employee_id": emp_id})
            if member:
                members.append({
                    "id": str(member["_id"]),
                    "name": member.get("name"),
                    "employee_id": member.get("employee_id"),
                    "email": member.get("email"),
                    "designation": member.get("designation"),
                })
        
        return jsonify({
            "team_id": team_id,
            "team_name": team.get("name"),
            "members": members,
            "total_members": len(members),
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_team_attendance(db, team_id):
    """Get team attendance summary"""
    try:
        date = request.args.get('date')
        
        if not date:
            date = datetime.utcnow().strftime("%Y-%m-%d")
        
        team = db.teams.find_one({"_id": ObjectId(team_id)})
        if not team:
            return jsonify({"error": "Team not found"}), 404
        
        # Get attendance for team members
        attendance = []
        for emp_id in team.get('members', []):
            member = db.users.find_one({"employee_id": emp_id})
            if member:
                check_in = db.attendance.find_one({
                    "user_id": member["_id"],
                    "date": date,
                    "check_type": "check_in"
                })
                
                attendance.append({
                    "name": member.get("name"),
                    "employee_id": emp_id,
                    "status": "present" if check_in else "absent",
                    "check_in_time": check_in.get("time") if check_in else None,
                })
        
        return jsonify({
            "date": date,
            "team_name": team.get("name"),
            "attendance": attendance,
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_my_team(db):
    """Get current user's team (for Team Leader)"""
    try:
        current_user_id = get_jwt_identity()
        
        user = db.users.find_one({"_id": ObjectId(current_user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Find team where this user is team_leader
        team = db.teams.find_one({"team_leader_id": ObjectId(current_user_id)})
        if not team:
            return jsonify({"error": "No team assigned"}), 404
        
        return jsonify(serialize_team(team)), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_all_teams(db):
    """Get all teams"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        total = db.teams.count_documents({})
        
        teams = list(db.teams.find({})
            .skip((page - 1) * limit)
            .limit(limit))
        
        return jsonify({
            "total": total,
            "page": page,
            "limit": limit,
            "teams": [serialize_team(t) for t in teams],
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
