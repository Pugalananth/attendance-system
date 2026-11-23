# Attendance Management System - Complete Setup Guide

## Project Overview

This is a professional corporate attendance management system with role-based access control (Employee, HR, Team Leader, Admin). The system includes face recognition for check-in/check-out, leave management, permission requests, work-from-home approvals, and comprehensive analytics.

## Architecture

### Backend (Flask + MongoDB)
- **Framework**: Flask 3.0.3
- **Database**: MongoDB
- **Authentication**: JWT (Flask-JWT-Extended)
- **Face Recognition**: DeepFace
- **API**: RESTful with CORS support

### Frontend (React Native)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation with Stack and Tab navigation
- **Theme**: Professional Corporate (Blue & Gray)
- **HTTP Client**: Axios

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Create `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=attendance_db

# JWT Configuration
JWT_SECRET_KEY=your_secret_key_here
JWT_ACCESS_TOKEN_EXPIRES=3600

# Flask Configuration
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your_secret_key

# Face Recognition
FACE_RECOGNITION_THRESHOLD=0.6

# Server
HOST=0.0.0.0
PORT=5000
```

### 3. Database Setup

MongoDB should be running. The database will be automatically created on first run.

### 4. Run Backend

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 2. Environment Configuration

Create `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For React Native (app.json or .env):

```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Frontend

```bash
# For web
npm start

# For React Native
expo start
# Then press 'a' for Android or 'i' for iOS
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Admin only)

### User Profile
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/employees` - Get all employees

### Attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance/history` - Get attendance history
- `GET /api/attendance/daily-summary` - Get today's summary

### Leave Management
- `POST /api/leave/request` - Create leave request
- `GET /api/leave/my-leaves` - Get user's leaves
- `GET /api/leave/pending` - Get pending leaves
- `POST /api/leave/<id>/approve` - Approve leave
- `POST /api/leave/<id>/reject` - Reject leave

### Permission Requests
- `POST /api/permission/request` - Create permission request
- `GET /api/permission/my-permissions` - Get user's permissions
- `GET /api/permission/pending` - Get pending permissions
- `POST /api/permission/<id>/approve` - Approve permission
- `POST /api/permission/<id>/reject` - Reject permission

### Work From Home
- `POST /api/wfh/request` - Create WFH request
- `GET /api/wfh/my-requests` - Get user's WFH requests
- `GET /api/wfh/pending` - Get pending WFH requests
- `POST /api/wfh/<id>/approve` - Approve WFH
- `POST /api/wfh/<id>/reject` - Reject WFH

### Team Management
- `POST /api/team/create` - Create team
- `POST /api/team/<id>/add-member` - Add team member
- `POST /api/team/<id>/remove-member` - Remove team member
- `GET /api/team/<id>/members` - Get team members
- `GET /api/team/<id>/attendance` - Get team attendance
- `GET /api/team/my-team` - Get current user's team
- `GET /api/team/all` - Get all teams

### Admin Operations
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employee/create` - Create employee
- `PUT /api/admin/employee/<id>/role` - Update employee role
- `POST /api/admin/employee/<id>/deactivate` - Deactivate employee
- `GET /api/admin/analytics` - Get attendance analytics
- `GET /api/admin/monthly-report` - Get monthly report
- `GET /api/admin/company` - Get company details
- `PUT /api/admin/company` - Update company details

## User Roles and Features

### Employee
- Check-in/Check-out with face recognition
- View attendance history
- Request leave
- Request permission (early leave, late arrival)
- Request work from home
- Update profile
- View pending requests status

### HR
- Check-in/Check-out with face recognition
- View all employees' attendance
- View own attendance
- Approve/Reject leave requests
- Approve/Reject permission requests
- Approve/Reject WFH requests
- Create and manage employees
- Register employee face
- Assign employees to teams
- Change employee roles (employee ↔ team leader)
- View monthly attendance reports
- HR profile management

### Team Leader
- Check-in/Check-out
- View team members details
- View team attendance
- View team permission and leave requests
- Assign work to team members
- Team leader profile management

### Admin
- Full system access
- Create/Edit/Delete users (employees, HR, team leaders, admins)
- Face recognition management
- Attendance analytics (day-wise, month-wise)
- View all requests
- Company settings management
- Employee team-wise view
- Generate attendance reports
- Admin profile management

## Database Models

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  employee_id: String,
  role: String (employee|hr|team_leader|admin),
  department: String,
  phone: String,
  team_id: ObjectId,
  team_leader_id: ObjectId,
  designation: String,
  date_of_joining: Date,
  status: String (active|inactive),
  face_registered: Boolean,
  created_at: Date,
  updated_at: Date,
  last_login: Date,
}
```

### Attendance
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  employee_id: String,
  name: String,
  check_type: String (check_in|check_out),
  timestamp: Date,
  date: String (YYYY-MM-DD),
  time: String (HH:MM:SS),
  latitude: Number,
  longitude: Number,
  confidence: Number,
  device_info: String,
  verified_by: String (face_recognition),
}
```

### Leave Requests
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  employee_id: String,
  name: String,
  leave_type: String (casual|sick|earned|unpaid),
  start_date: String,
  end_date: String,
  reason: String,
  status: String (pending|approved|rejected),
  approved_by: ObjectId,
  approval_date: Date,
  remarks: String,
  created_at: Date,
  updated_at: Date,
}
```

Similar models exist for Permissions, WFH Requests, and Teams.

## Theme Configuration

The application uses a professional corporate theme with the following colors:

- **Primary**: #1e3a5f (Deep Blue)
- **Secondary**: #6b7280 (Gray)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)
- **Text Primary**: #111827
- **Text Secondary**: #6b7280
- **Background**: #f9fafb

## Frontend Screen Structure

### Employee Screens
- Dashboard
- Check In (Face Recognition)
- Attendance History
- Leave Request
- Permission Request
- WFH Request
- Profile

### HR Screens
- Dashboard
- Check In
- All Employee Attendance
- My Attendance
- Requests Approval
- Employee Management
- Monthly Report
- Profile

### Team Leader Screens
- Dashboard
- Check In
- Team Employee
- Permission & Leave
- Team Attendance
- Work Assignment
- Profile

### Admin Screens
- Dashboard
- Employee Management
- Attendance Analytics
- Request Management
- Company Details
- Profile

## Remaining Implementation Tasks

1. **Screen Components**: Create actual implementations for all screens (templates provided in FRONTEND_STRUCTURE.md)

2. **Face Recognition**: Implement face capture and recognition functionality

3. **Service Layers**: Complete all service files for API communication

4. **Error Handling**: Add comprehensive error handling and validation

5. **Notifications**: Implement push notifications for request approvals

6. **Analytics**: Complete analytics visualizations and reports

7. **Testing**: Add unit and integration tests

8. **Deployment**: Set up CI/CD pipeline and deploy to production

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt
2. **JWT Tokens**: Use JWT for stateless authentication with expiration
3. **HTTPS**: Enable HTTPS in production
4. **CORS**: Configure CORS appropriately for production
5. **Environment Variables**: Keep sensitive data in environment variables
6. **Face Data**: Store face embeddings securely, never store raw face images unnecessarily
7. **Rate Limiting**: Implement rate limiting on auth endpoints
8. **Input Validation**: Validate all user inputs server-side

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running
- Check API_URL configuration in frontend
- Verify CORS settings in Flask app
- Check network connectivity

### Face Recognition Issues
- Ensure proper lighting conditions
- Clear face registration if issues persist
- Check face_recognition confidence threshold
- Verify camera permissions on mobile device

### Database Issues
- Connect to MongoDB: `mongo` or use MongoDB Compass
- Check connection string in .env
- Verify database and collection creation

## Next Steps

1. Complete screen implementations using provided templates
2. Add comprehensive error handling and user feedback
3. Implement face recognition features
4. Add push notifications
5. Set up automated testing
6. Deploy to staging environment
7. Conduct user acceptance testing
8. Deploy to production

## Support

For issues or questions, refer to:
- Backend Issues: Check logs in terminal
- Frontend Issues: Check browser console
- Database Issues: Check MongoDB logs
- API Issues: Test endpoints with Postman or Thunder Client

---

**Last Updated**: 2026-05-29
**Version**: 1.0.0
