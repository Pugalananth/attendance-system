"""
Enterprise Attendance Controller
AI Employee Attendance Management System
"""

import io
import csv
import logging
import calendar

from datetime import (
    datetime,
    date,
)

from flask import (
    request,
    jsonify,
    make_response,
)

from bson import ObjectId

from utils.db import get_db



logger = logging.getLogger(__name__)

# =========================================================
# BSON SERIALIZER
# =========================================================

def serialize_doc(doc):

    if not doc:
        return doc

    doc["_id"] = str(doc["_id"])

    return doc


def serialize_list(docs):

    return [
        serialize_doc(doc)
        for doc in docs
    ]


def get_attendance_sources(db):

    sources = [
        db["attendance"]
    ]

    for db_name in [
        "employee_attendance",
        "facetrack_office",
    ]:
        legacy_db = db.client[db_name]

        if "attendance" in legacy_db.list_collection_names():
            sources.append(
                legacy_db["attendance"]
            )

    return sources


def get_employee_lookup(db):

    lookup = {}

    employee_sources = [
        (
            db["users"],
            {}
        ),
    ]

    legacy_db = db.client["employee_attendance"]
    if "employees" in legacy_db.list_collection_names():
        employee_sources.append(
            (
                legacy_db["employees"],
                {}
            )
        )

    face_db = db.client["facetrack_office"]
    if "users" in face_db.list_collection_names():
        employee_sources.append(
            (
                face_db["users"],
                {}
            )
        )

    for collection, query in employee_sources:
        for employee in collection.find(query):
            employee_id = employee.get("employee_id")
            email = employee.get("email")
            name = (
                employee.get("name") or
                employee.get("fullName") or
                employee.get("employee_name") or
                ""
            )
            department = (
                employee.get("department") or
                "General"
            )

            employee_info = {
                "employee_id": employee_id,
                "employee_name": name,
                "department": department,
                "email": email,
            }

            for key in [
                employee_id,
                email,
            ]:
                if key:
                    lookup[
                        str(key).strip().lower()
                    ] = employee_info

    return lookup


def normalize_attendance_record(record, employee_lookup):

    record = dict(record)
    record["_id"] = str(record["_id"])

    lookup_keys = [
        record.get("employee_id"),
        record.get("email"),
    ]

    employee = None

    for key in lookup_keys:
        if key:
            employee = employee_lookup.get(
                str(key).strip().lower()
            )

            if employee:
                break

    if employee:
        record["employee_id"] = (
            record.get("employee_id") or
            employee.get("employee_id")
        )
        record["employee_name"] = (
            record.get("employee_name") or
            employee.get("employee_name")
        )
        record["department"] = (
            record.get("department") or
            employee.get("department")
        )

    record["employee_name"] = (
        record.get("employee_name") or
        record.get("employee") or
        record.get("email") or
        "Unknown Employee"
    )

    record["department"] = (
        record.get("department") or
        "General"
    )

    record["check_in"] = (
        record.get("check_in") or
        record.get("time") or
        "--"
    )

    record["status"] = (
        record.get("status") or
        "Present"
    )

    return record


# =========================================================
# MARK ATTENDANCE
# =========================================================

def mark_attendance():
    print("MARK ATTENDANCE API CALLED")
    print("INSERTING:", attendance_doc)

    try:

        data = request.get_json()

        if not data:

            return jsonify({

                "success": False,
                "message": "Request body required"

            }), 400

        # =================================================
        # REQUEST DATA
        # =================================================

        employee_id = str(

            data.get(
                "employee_id",
                ""
            )

        ).strip()

        confidence = float(

            data.get(
                "confidence",
                0
            )

        )

        location = data.get(
            "location",
            "Office"
        )

        device_info = request.headers.get(

            "User-Agent",

            "Mobile App"

        )

        # =================================================
        # VALIDATION
        # =================================================

        if not employee_id:

            return jsonify({

                "success": False,

                "message":
                    "Employee ID required"

            }), 400

        # =================================================
        # DATABASE
        # =================================================

        db = get_db()

        employee = db["users"].find_one({

            "employee_id":
                employee_id,

            "is_active":
                True,

        })

        if not employee:

            return jsonify({

                "success": False,

                "message":
                    "Employee not found"

            }), 404

        # =================================================
        # DATE
        # =================================================

        now = datetime.now()

        today = now.strftime(
            "%Y-%m-%d"
        )

        current_time = now.strftime(
            "%I:%M %p"
        )

        # =================================================
        # DUPLICATE CHECK
        # =================================================

        existing = db["attendance"].find_one({

            "employee_id":
                employee_id,

            "date":
                today,

        })

        if existing:

            return jsonify({

                "success": False,

                "message":
                    "Attendance already marked today"

            }), 409

        # =================================================
        # STATUS
        # =================================================

        status = "Present"

        if now.hour >= 9:

            status = "Late"

        # =================================================
        # ATTENDANCE DOC
        # =================================================

        attendance_doc = {

            "employee_id":
                employee_id,

            "employee_name":
                employee.get(
                    "name",
                    ""
                ),

            "department":
                employee.get(
                    "department",
                    ""
                ),

            "role":
                employee.get(
                    "role",
                    "employee"
                ),

            "date":
                today,

            "check_in":
                current_time,

            "status":
                status,

            "confidence":
                confidence,

            "location":
                location,

            "device_info":
                device_info,

            "ai_verified":
                True,

            "liveness_verified":
                True,

            "spoof_detected":
                False,

            "created_at":
                datetime.utcnow(),

        }

        # =================================================
        # INSERT
        # =================================================

        result = db["attendance"].insert_one(
            attendance_doc
        )

        attendance_doc["_id"] = str(
            result.inserted_id
        )

        logger.info(

            f"Attendance marked: {employee_id}"

        )

        return jsonify({

            "success": True,

            "message":
                "Attendance marked successfully",

            "data":
                attendance_doc,

        }), 201

    except Exception as e:

        logger.error(
            f"Mark attendance error: {e}"
        )

        return jsonify({

            "success": False,

            "message":
                str(e)

        }), 500


# =========================================================
# GET ALL ATTENDANCE
# =========================================================

def get_all_attendance():

    try:

        db = get_db()

        page = int(
            request.args.get(
                "page",
                1
            )
        )

        limit = int(
            request.args.get(
                "limit",
                50
            )
        )

        skip = (page - 1) * limit

        employee_lookup = get_employee_lookup(
            db
        )

        all_records = []

        for source in get_attendance_sources(db):
            all_records.extend(
                list(
                    source.find()
                )
            )

        def sort_key(record):
            return (
                str(
                    record.get("created_at") or
                    record.get("date") or
                    ""
                ),
                str(
                    record.get("time") or
                    record.get("check_in") or
                    ""
                )
            )

        all_records = sorted(
            all_records,
            key=sort_key,
            reverse=True
        )

        total = len(all_records)

        records = [
            normalize_attendance_record(
                record,
                employee_lookup
            )
            for record in all_records[
                skip: skip + limit
            ]
        ]

        return jsonify({

            "success": True,

            "data": {

                "records":
                    records,

                "pagination": {

                    "page":
                        page,

                    "limit":
                        limit,

                    "total":
                        total,

                }

            }

        }), 200

    except Exception as e:

        logger.error(
            f"Attendance fetch error: {e}"
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to fetch attendance"

        }), 500


# =========================================================
# GET EMPLOYEE ATTENDANCE
# =========================================================

def get_student_attendance(
    employee_id
):

    try:

        db = get_db()

        records = list(

            db["attendance"]

            .find({

                "employee_id":
                    employee_id

            })

            .sort(
                "created_at",
                -1
            )

        )

        records = serialize_list(
            records
        )

        return jsonify({

            "success": True,

            "data":
                records,

        }), 200

    except Exception as e:

        logger.error(
            f"Employee attendance error: {e}"
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to fetch employee attendance"

        }), 500


# =========================================================
# REPORT
# =========================================================

def get_attendance_report():

    try:

        db = get_db()

        today = date.today().strftime(
            "%Y-%m-%d"
        )

        total = db["attendance"] \
            .count_documents({

                "date": today

            })

        present = db["attendance"] \
            .count_documents({

                "date": today,

                "status": "Present"

            })

        late = db["attendance"] \
            .count_documents({

                "date": today,

                "status": "Late"

            })

        records = list(
            db["attendance"]
            .find({
                "date": today
            })
            .sort(
                "created_at",
                -1
            )
        )

        records = serialize_list(
            records
        )

        return jsonify({

            "success": True,

            "data": {

                "date":
                    today,

                "total":
                    total,

                "present":
                    present,

                "late":
                    late,

                "records":
                    records,

            }

        }), 200

    except Exception as e:

        logger.error(
            f"Report error: {e}"
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to generate report"

        }), 500


# =========================================================
# MONTHLY REPORT
# =========================================================

def get_monthly_attendance_report():

    try:

        db = get_db()

        now = datetime.utcnow()

        year_requested = request.args.get(
            "year"
        ) is not None

        month_requested = request.args.get(
            "month"
        ) is not None

        year = int(
            request.args.get(
                "year",
                now.year
            )
        )

        month = int(
            request.args.get(
                "month",
                now.month
            )
        )

        working_days = int(
            request.args.get(
                "working_days",
                0
            )
        )

        if working_days <= 0:
            working_days = sum(
                1 for day in range(
                    1,
                    calendar.monthrange(
                        year,
                        month
                    )[1] + 1
                )
                if date(
                    year,
                    month,
                    day
                ).weekday() < 5
            )

        start_date = f"{year}-{month:02d}-01"
        last_day = calendar.monthrange(
            year,
            month
        )[1]
        end_date = f"{year}-{month:02d}-{last_day:02d}"

        employee_query = {
            "role": {
                "$in": [
                    "employee",
                    "Employee",
                    "teamleader",
                    "team_leader",
                ]
            },
            "$or": [
                {"is_active": True},
                {"status": {"$in": ["active", "Active"]}},
                {"status": {"$exists": False}},
            ],
        }

        employees = list(
            db["users"].find(
                employee_query,
                {
                    "employee_id": 1,
                    "name": 1,
                    "email": 1,
                    "department": 1,
                }
            )
        )

        employee_ids = [
            employee.get("employee_id")
            for employee in employees
            if employee.get("employee_id")
        ]

        employee_emails = [
            employee.get("email")
            for employee in employees
            if employee.get("email")
        ]

        report_sources = [
            db["attendance"]
        ]

        for db_name in [
            "employee_attendance",
            "facetrack_office",
        ]:
            legacy_db = db.client[db_name]
            if "attendance" in legacy_db.list_collection_names():
                report_sources.append(
                    legacy_db["attendance"]
                )

        def month_query():
            match_fields = []

            if employee_ids:
                match_fields.append({
                    "employee_id": {
                        "$in": employee_ids
                    }
                })

            if employee_emails:
                match_fields.append({
                    "email": {
                        "$in": employee_emails
                    }
                })

            query = {
                "date": {
                    "$gte": start_date,
                    "$lte": end_date,
                },
            }

            if match_fields:
                query["$or"] = match_fields

            return query

        attendance_records = []

        for source in report_sources:
            attendance_records.extend(
                list(
                    source.find(
                        month_query()
                    )
                )
            )

        if (
            not attendance_records and
            not year_requested and
            not month_requested
        ):
            latest_record = None

            for source in report_sources:
                record = source.find_one(
                    {
                        "date": {
                            "$exists": True
                        }
                    },
                    sort=[
                        ("date", -1)
                    ]
                )

                if not record:
                    continue

                if (
                    latest_record is None or
                    str(record.get("date", "")) >
                    str(latest_record.get("date", ""))
                ):
                    latest_record = record

            if latest_record:
                latest_date = str(
                    latest_record.get("date")
                )

                year = int(
                    latest_date[0:4]
                )

                month = int(
                    latest_date[5:7]
                )

                working_days = sum(
                    1 for day in range(
                        1,
                        calendar.monthrange(
                            year,
                            month
                        )[1] + 1
                    )
                    if date(
                        year,
                        month,
                        day
                    ).weekday() < 5
                )

                start_date = f"{year}-{month:02d}-01"
                last_day = calendar.monthrange(
                    year,
                    month
                )[1]
                end_date = f"{year}-{month:02d}-{last_day:02d}"

                for source in report_sources:
                    attendance_records.extend(
                        list(
                            source.find(
                                month_query()
                            )
                        )
                    )

        records_by_employee = {}

        for record in attendance_records:
            keys = [
                record.get("employee_id"),
                record.get("email"),
            ]

            keys = [
                str(key).strip().lower()
                for key in keys
                if key
            ]

            for key in keys:
                records_by_employee.setdefault(
                    key,
                    []
                ).append(record)

        employee_reports = []
        present_total = 0
        late_total = 0

        for employee in employees:
            employee_id = employee.get(
                "employee_id"
            )

            employee_keys = [
                employee_id,
                employee.get("email"),
            ]

            employee_keys = [
                str(key).strip().lower()
                for key in employee_keys
                if key
            ]

            records = []
            seen_record_ids = set()

            for key in employee_keys:
                for record in records_by_employee.get(
                    key,
                    []
                ):
                    record_id = str(
                        record.get("_id", id(record))
                    )

                    if record_id in seen_record_ids:
                        continue

                    seen_record_ids.add(record_id)
                    records.append(record)

            present_days = len([
                record for record in records
                if record.get("status") == "Present"
            ])

            late_days = len([
                record for record in records
                if record.get("status") == "Late"
            ])

            attended_days = len(set([
                record.get("date")
                for record in records
                if record.get("date")
            ]))

            percentage = 0
            if working_days > 0:
                percentage = round(
                    (
                        attended_days /
                        working_days
                    ) * 100
                )

            present_total += present_days
            late_total += late_days

            employee_reports.append({
                "employee_id": employee_id,
                "name": employee.get(
                    "name",
                    ""
                ),
                "department": employee.get(
                    "department",
                    "General"
                ) or "General",
                "present_days": present_days,
                "late_days": late_days,
                "attended_days": attended_days,
                "working_days": working_days,
                "percentage": percentage,
            })

        total_employees = len(employees)
        employees_with_attendance = len([
            employee for employee in employee_reports
            if employee["attended_days"] > 0
        ])

        absent_employees = max(
            total_employees -
            employees_with_attendance,
            0
        )

        possible_attendance = (
            total_employees *
            working_days
        )
        attended_total = sum([
            employee["attended_days"]
            for employee in employee_reports
        ])

        avg_attendance_percentage = 0
        if possible_attendance > 0:
            avg_attendance_percentage = round(
                (
                    attended_total /
                    possible_attendance
                ) * 100
            )

        today = datetime.utcnow().strftime(
            "%Y-%m-%d"
        )

        today_attended = len(set([
            record.get("employee_id")
            for record in attendance_records
            if record.get("date") == today and
            record.get("employee_id")
        ]))

        return jsonify({

            "success": True,

            "data": {

                "year":
                    year,

                "month":
                    month,

                "start_date":
                    start_date,

                "end_date":
                    end_date,

                "summary": {

                    "total_employees":
                        total_employees,

                    "present":
                        present_total,

                    "absent":
                        absent_employees,

                    "late":
                        late_total,

                    "working_days":
                        working_days,

                    "avg_attendance_percentage":
                        avg_attendance_percentage,
                },

                "attendance_rate":
                    avg_attendance_percentage,

                "present":
                    present_total,

                "absent":
                    absent_employees,

                "late":
                    late_total,

                "employees":
                    employee_reports,

                "records":
                    serialize_list(
                        attendance_records
                    ),
            }

        }), 200

    except Exception as e:

        logger.error(
            f"Monthly report error: {e}"
        )

        return jsonify({

            "success": False,

            "message":
                "Failed to generate monthly report"

        }), 500


# =========================================================
# EXPORT CSV
# =========================================================

def export_csv():

    try:

        db = get_db()

        records = list(
            db["attendance"].find()
        )

        output = io.StringIO()

        writer = csv.writer(output)

        writer.writerow([

            "Employee ID",
            "Employee Name",
            "Department",
            "Date",
            "Check In",
            "Status",

        ])

        for r in records:

            writer.writerow([

                r.get(
                    "employee_id",
                    ""
                ),

                r.get(
                    "employee_name",
                    ""
                ),

                r.get(
                    "department",
                    ""
                ),

                r.get(
                    "date",
                    ""
                ),

                r.get(
                    "check_in",
                    ""
                ),

                r.get(
                    "status",
                    ""
                ),

            ])

        response = make_response(
            output.getvalue()
        )

        response.headers[
            "Content-Type"
        ] = "text/csv"

        response.headers[
            "Content-Disposition"
        ] = \
            "attachment; filename=attendance.csv"

        return response

    except Exception as e:

        logger.error(
            f"CSV export error: {e}"
        )

        return jsonify({

            "success": False,

            "message":
                "CSV export failed"

        }), 500

def get_employee_report():

    try:

        current_user = request.current_user

        employee_id = current_user["employee_id"]

        db = get_db()

        records = list(
            db["attendance"].find(
                {
                    "employee_id": employee_id
                }
            )
        )

        total = len(records)

        present = len([
            r for r in records
            if r.get("status") == "Present"
        ])

        late = len([
            r for r in records
            if r.get("late", False)
        ])

        return jsonify({
            "success": True,
            "data": {
                "total": total,
                "present": present,
                "late": late
            }
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
