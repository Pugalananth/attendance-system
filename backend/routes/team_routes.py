"""
Team Routes - Team Management
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required
from controllers.team_controller import (
    create_team,
    add_team_member,
    remove_team_member,
    get_team_members,
    get_team_attendance,
    get_my_team,
    get_all_teams,
)
from utils.db import get_db

team_bp = Blueprint(
    'team',
    __name__,
    url_prefix='/api/team'
)

@team_bp.route('/create', methods=['POST'])
@jwt_required()
def create_new_team():
    db = get_db()
    return create_team(db)

@team_bp.route('/<team_id>/add-member', methods=['POST'])
@jwt_required()
def add_member(team_id):
    db = get_db()
    return add_team_member(db, team_id)

@team_bp.route('/<team_id>/remove-member', methods=['POST'])
@jwt_required()
def remove_member(team_id):
    db = get_db()
    return remove_team_member(db, team_id)

@team_bp.route('/<team_id>/members', methods=['GET'])
@jwt_required()
def members(team_id):
    db = get_db()
    return get_team_members(db, team_id)

@team_bp.route('/<team_id>/attendance', methods=['GET'])
@jwt_required()
def team_attendance(team_id):
    db = get_db()
    return get_team_attendance(db, team_id)

@team_bp.route('/my-team', methods=['GET'])
@jwt_required()
def my_team():
    db = get_db()
    return get_my_team(db)

@team_bp.route('/all', methods=['GET'])
@jwt_required()
def all_teams():
    db = get_db()
    return get_all_teams(db)
