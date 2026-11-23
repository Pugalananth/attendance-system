from pymongo import MongoClient

# MongoDB Connection
MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

# Database
db = client["employee_attendance"]

# Collections
employees_collection = db["employees"]

attendance_collection = db["attendance"]

print("MongoDB Connected Successfully")