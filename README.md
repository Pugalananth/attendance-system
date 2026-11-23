# 🎓 FaceAttend — AI Face Recognition Attendance System

A production-ready mobile attendance system using **DeepFace** + **OpenCV** face recognition, **Flask** backend, **MongoDB Atlas**, and a **React Native Expo** mobile app with a premium dark UI.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Face Recognition Flow](#-face-recognition-flow)
- [Features](#-features)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Mobile App  | React Native + Expo SDK 51                     |
| Navigation  | React Navigation v6 (Native Stack)             |
| HTTP Client | Axios with JWT interceptors                    |
| Camera      | expo-camera (CameraView API)                   |
| Auth State  | React Context + AsyncStorage                   |
| Backend     | Python Flask 3.0                               |
| Face AI     | DeepFace (Facenet512 model) + OpenCV           |
| Database    | MongoDB Atlas (pymongo)                        |
| Auth        | JWT (PyJWT) + bcrypt                           |
| CORS        | Flask-CORS                                     |

---

## 📁 Project Structure

```
attendance-system/
├── backend/
│   ├── app.py                    # Flask entry point
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables template
│   ├── routes/
│   │   ├── auth_routes.py        # Auth endpoints
│   │   ├── student_routes.py     # Student CRUD
│   │   ├── face_routes.py        # Face register/verify
│   │   └── attendance_routes.py  # Attendance management
│   ├── controllers/
│   │   ├── auth_controller.py
│   │   ├── student_controller.py
│   │   ├── face_controller.py
│   │   └── attendance_controller.py
│   ├── models/
│   │   ├── user_model.py         # User schema + hashing
│   │   ├── face_model.py         # Face embedding schema
│   │   └── attendance_model.py   # Attendance schema
│   ├── utils/
│   │   ├── db.py                 # MongoDB connection pool
│   │   ├── jwt_utils.py          # Token generation/auth decorators
│   │   └── face_utils.py         # DeepFace + OpenCV utilities
│   ├── uploads/                  # Stored face images
│   └── embeddings/               # (reserved)
│
└── frontend/
    ├── App.js                    # Root entry point
    ├── app.json                  # Expo configuration
    ├── package.json
    ├── babel.config.js
    ├── navigation/
    │   └── AppNavigator.js       # Auth-gated role-based routing
    ├── context/
    │   └── AuthContext.js        # Global auth state + JWT management
    ├── services/
    │   └── api.js                # Axios + all API endpoints
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js
    │   │   └── RegisterScreen.js
    │   ├── student/
    │   │   ├── StudentDashboard.js
    │   │   ├── FaceAttendanceScreen.js   # Camera + real-time verification
    │   │   ├── FaceRegisterScreen.js     # 5-image guided capture
    │   │   ├── AttendanceHistoryScreen.js
    │   │   └── ProfileScreen.js
    │   └── admin/
    │       ├── AdminDashboard.js
    │       ├── ManageStudentsScreen.js
    │       ├── StudentFormScreens.js     # Add + Edit
    │       ├── AllAttendanceScreen.js
    │       └── AttendanceReportScreen.js
    ├── components/
    │   ├── GradientButton.js
    │   ├── GlassCard.js
    │   ├── InputField.js
    │   ├── LoadingScreen.js
    │   ├── StatCard.js
    │   └── AttendanceBadge.js
    ├── hooks/
    │   ├── useAttendance.js
    │   └── useFace.js
    ├── constants/
    │   ├── theme.js              # Colors, fonts, spacing, shadows
    │   └── config.js             # API URL, storage keys
    └── utils/
        └── helpers.js
```

---

## ✅ Prerequisites

- **Python** 3.10+ 
- **Node.js** 18+ and npm
- **MongoDB Atlas** account (free tier works)
- **Expo Go** app on your phone (iOS/Android)
- Phone and computer on the **same Wi-Fi network**

---

## 🐍 Backend Setup

### 1. Clone & navigate

```bash
cd attendance-system/backend
```

### 2. Create virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> ⏳ First install takes 5–10 minutes (TensorFlow + DeepFace are large)

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_db
JWT_SECRET_KEY=your-32-char-secret-here
PORT=5000
FLASK_DEBUG=True
```

### 5. Create MongoDB Atlas cluster

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free M0 cluster
3. Add database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all — for development)
5. Get connection string and paste into `.env`

### 6. Run the server

```bash
python app.py
```

You should see:
```
✅ MongoDB Atlas connected successfully
🚀 Starting Face Attendance API on port 5000
```

### 7. Create initial admin account

```bash
curl -X POST http://localhost:5000/api/auth/setup-admin
```

Default admin credentials:
- Email: `admin@attendance.com`
- Password: `Admin@123456`

---

## 📱 Frontend Setup

### 1. Navigate to frontend

```bash
cd attendance-system/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Update API URL

Edit `constants/config.js`:
```js
// Replace with your computer's local IP address
export const API_BASE_URL = 'http://192.168.X.X:5000/api';
```

**Find your IP:**
- **Windows:** `ipconfig` → IPv4 Address
- **macOS:** `ifconfig | grep inet`
- **Linux:** `hostname -I`

### 4. Start Expo

```bash
npx expo start
```

Scan the QR code with **Expo Go** app on your phone.

---

## 🔑 Environment Variables

### Backend `.env`

| Variable                   | Description                          | Required |
|---------------------------|--------------------------------------|----------|
| `MONGO_URI`               | MongoDB Atlas connection string      | ✅       |
| `JWT_SECRET_KEY`          | Min 32-char JWT signing secret       | ✅       |
| `PORT`                    | Server port (default: 5000)          | No       |
| `FLASK_DEBUG`             | Enable debug mode                    | No       |
| `FACE_VERIFICATION_THRESHOLD` | Face match threshold (0.0–1.0)   | No       |
| `DEEPFACE_MODEL`          | Model name (default: Facenet512)     | No       |
| `DEEPFACE_DETECTOR`       | Detector backend (default: opencv)   | No       |
| `ADMIN_EMAIL`             | Default admin email                  | No       |
| `ADMIN_PASSWORD`          | Default admin password               | No       |

---

## 🌐 API Reference

### Auth
| Method | Endpoint              | Auth | Description            |
|--------|-----------------------|------|------------------------|
| POST   | `/api/auth/register`  | No   | Register new user      |
| POST   | `/api/auth/login`     | No   | Login, get tokens      |
| POST   | `/api/auth/refresh`   | No   | Refresh access token   |
| GET    | `/api/auth/profile`   | ✅   | Get current user       |
| POST   | `/api/auth/setup-admin` | No | Create first admin   |

### Students (Admin only)
| Method | Endpoint                        | Description        |
|--------|---------------------------------|--------------------|
| GET    | `/api/students`                 | List all students  |
| POST   | `/api/students/add`             | Add student        |
| PUT    | `/api/students/update/:id`      | Update student     |
| DELETE | `/api/students/delete/:id`      | Delete student     |
| GET    | `/api/students/stats/dashboard` | Dashboard stats    |

### Face Recognition
| Method | Endpoint                  | Auth | Description          |
|--------|---------------------------|------|----------------------|
| POST   | `/api/face/register`      | ✅   | Register face (3–5 images) |
| POST   | `/api/face/verify`        | ✅   | Verify face identity |
| GET    | `/api/face/status/:id`    | ✅   | Check face status    |
| DELETE | `/api/face/delete/:id`    | Admin | Remove face data   |

### Attendance
| Method | Endpoint                      | Auth  | Description          |
|--------|-------------------------------|-------|----------------------|
| POST   | `/api/attendance/mark`        | ✅    | Mark attendance      |
| GET    | `/api/attendance/all`         | Admin | All records          |
| GET    | `/api/attendance/student/:id` | ✅    | Student's records    |
| GET    | `/api/attendance/report`      | Admin | Monthly report       |
| GET    | `/api/attendance/export`      | Admin | Export CSV           |

---

## 🤖 Face Recognition Flow

### Registration (5 images)
```
Student → Open Camera → Capture 5 Images (guided angles)
        → Validate each (face count, liveness)
        → Preprocess (CLAHE, denoise)
        → Generate DeepFace embedding (512-dim vector)
        → Store embeddings + avg_embedding in MongoDB
        → Update user.face_registered = true
```

### Attendance Verification (1:1 or 1:N)
```
Student → Open Camera → Capture live frame
        → Face validation (exactly 1 face)
        → Anti-spoof check (Laplacian + saturation analysis)
        → Preprocess frame
        → Generate probe embedding
        → Cosine distance vs stored embeddings
        → If distance ≤ threshold (0.6): VERIFIED
        → Check duplicate attendance
        → Save attendance record to MongoDB
```

### Face Models Available
- `Facenet512` ✅ (default, best accuracy)
- `VGG-Face`
- `ArcFace`
- `DeepFace`

---

## ✨ Features

### Student App
- ✅ Login / Register with JWT
- ✅ Dashboard with attendance percentage circle
- ✅ Face registration (guided 5-image capture)
- ✅ Live face attendance marking
- ✅ Monthly attendance history with pagination
- ✅ Profile page with settings
- ✅ Auto-login via stored token

### Admin Panel
- ✅ Dashboard with stats (total, today, rate, trend chart)
- ✅ Student management (CRUD with search)
- ✅ Add / Edit / Delete students
- ✅ Reset student face data
- ✅ All attendance records with date filter
- ✅ Monthly analytics report with per-student breakdown
- ✅ CSV export (attendance data)
- ✅ 7-day trend bar chart

### Security
- ✅ JWT access + refresh tokens (24hr / 7day)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Protected routes (role-based decorators)
- ✅ Anti-spoofing (liveness detection)
- ✅ Duplicate attendance prevention
- ✅ Input validation (all endpoints)

---

## 🚀 Deployment

### Backend → Render (Free)

1. Push backend to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set:
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn app:create_app()`
4. Add all environment variables
5. Deploy

### Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

### Frontend → Expo EAS Build (Android APK)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- Ensure phone and computer are on the **same Wi-Fi**
- Use your computer's local IP (not `localhost`)
- Check firewall allows port 5000

### "No face detected"
- Ensure good lighting on the face
- Look directly at the camera
- Increase distance slightly from camera
- Reduce `DEEPFACE_DETECTOR` timeout in .env

### "DeepFace import error"
```bash
pip install tf-keras==2.16.0 tensorflow==2.16.1 deepface==0.0.93
```

### "MongoDB connection failed"
- Check `MONGO_URI` is correct
- Whitelist your IP in MongoDB Atlas (Network Access)
- Check username/password in connection string

### Camera permissions denied
- On Android: Settings → Apps → FaceAttend → Permissions → Camera
- On iOS: Settings → FaceAttend → Camera

### Expo "metro bundler" errors
```bash
npx expo start --clear
# or
npm install --legacy-peer-deps
```

---

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/

# Setup admin
curl -X POST http://localhost:5000/api/auth/setup-admin

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@attendance.com","password":"Admin@123456"}'

# Get students (use token from login response)
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Face Recognition
1. Register a student account via the mobile app
2. Open "Register Face" → capture 5 images
3. Open "Mark Attendance" → verify live face
4. Check admin dashboard for the new record

---

## 📝 Notes

- DeepFace downloads model weights (~90MB) on **first run** — this takes a few minutes
- Face images are stored in `backend/uploads/` folder
- MongoDB Atlas free tier has 512MB storage (sufficient for hundreds of students)
- Facenet512 generates 512-dimensional embeddings stored as arrays in MongoDB

---

Made with ❤️ using DeepFace AI + React Native Expo
#   a t t e n d a n c e - s y s t e m  
 