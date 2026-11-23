"""
Enterprise AI Attendance Backend
Production Flask Server
"""

import os
import logging

from flask import (
    Flask,
    jsonify,
)

from flask_cors import CORS

from dotenv import load_dotenv

from utils.db import (
    connect_db,
    db_health,
)

# =========================================================
# LOAD ENV
# =========================================================

load_dotenv()

# =========================================================
# LOGGING
# =========================================================

logging.basicConfig(

    level=logging.INFO,

    format=
        "%(asctime)s [%(levelname)s] %(message)s"

)

logger = logging.getLogger(__name__)

# =========================================================
# CREATE APP
# =========================================================

print(
    "RUNNING APP FROM:",
    __file__
)

app = Flask(__name__)

# =========================================================
# CONFIG
# =========================================================

app.config["SECRET_KEY"] = os.getenv(

    "SECRET_KEY",

    "ENTERPRISE_SECRET_KEY"

)

# =========================================================
# CORS
# =========================================================

CORS(

    app,

    resources={

        r"/api/*": {

            "origins": "*"

        }

    }

)

# =========================================================
# DATABASE INIT
# =========================================================

try:

    connect_db()

    logger.info(
        "Database initialized"
    )

except Exception as e:

    logger.error(
        f"Database startup failed: {e}"
    )

# =========================================================
# IMPORT ROUTES
# =========================================================

from routes.auth_routes import auth_bp

from routes.attendance_routes import (
    attendance_bp
)
from routes.face_routes import (
    face_bp
)
from routes.leave_routes import (
    leave_bp
)
from routes.employee_routes import (
    employee_bp
)
from routes.wfh_routes import (
    wfh_bp
)

# =========================================================
# REGISTER BLUEPRINTS
# =========================================================

app.register_blueprint(auth_bp, url_prefix='/api/auth')

app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
app.register_blueprint(face_bp, url_prefix='/api/face')
app.register_blueprint(leave_bp, url_prefix='/api/leave')
app.register_blueprint(employee_bp, url_prefix='/api/employee')
app.register_blueprint(wfh_bp, url_prefix='/api/wfh')

logger.info(
    "Blueprints registered successfully"
)

# =========================================================
# ROOT
# =========================================================

@app.route("/", methods=["GET"])

def home():

    return jsonify({

        "success": True,

        "message":
            "Enterprise AI Attendance API Running",

        "version":
            "1.0.0",

        "status":
            "online",

    }), 200

# =========================================================
# API HEALTH
# =========================================================

@app.route(
    "/api/health",
    methods=["GET"]
)

def health():

    db_status = db_health()

    return jsonify({

        "success": True,

        "server":
            "running",

        "database":
            db_status,

    }), 200

# =========================================================
# DEBUG ROUTES
# =========================================================

@app.route(
    "/api/routes",
    methods=["GET"]
)

def get_routes():

    routes = []

    for rule in app.url_map.iter_rules():

        routes.append({

            "endpoint":
                rule.endpoint,

            "methods":
                list(rule.methods),

            "route":
                str(rule)

        })

    return jsonify({

        "success": True,

        "routes": routes

    })

# =========================================================
# 404
# =========================================================

@app.errorhandler(404)

def not_found(error):

    return jsonify({

        "success": False,

        "message":
            "API endpoint not found"

    }), 404

# =========================================================
# 500
# =========================================================

@app.errorhandler(500)

def internal_error(error):

    logger.error(
        f"Internal server error: {error}"
    )

    return jsonify({

        "success": False,

        "message":
            "Internal server error"

    }), 500

# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    PORT = int(

        os.getenv(

            "PORT",

            5000

        )

    )

    logger.info(

        f"Starting Enterprise API on port {PORT}"

    )

    # ==============================================
    # PRINT ALL ROUTES
    # ==============================================

    print("\n========== REGISTERED ROUTES ==========")

    for rule in app.url_map.iter_rules():

        print(

            f"{rule.endpoint:30s}"

            f"{str(rule):40s}"

            f"{','.join(rule.methods)}"

        )

    print("=======================================\n")

    # ==============================================
    # RUN APP
    # ==============================================

    app.run(

        host="0.0.0.0",

        port=PORT,

        debug=True,

        threaded=True,

    )