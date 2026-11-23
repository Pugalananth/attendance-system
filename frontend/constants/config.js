/**
 * App Configuration Constants
 */

// Replace with your backend server IP/URL
// For local development: use your machine's local IP (not localhost)
// For production: use your deployed backend URL

export const API_BASE_URL = 'http://192.168.0.108:5000/api';

export const APP_CONFIG = {
  name: 'FaceAttend',
  version: '1.0.0',
  supportEmail: 'support@faceattend.com',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@face_attend_access_token',
  REFRESH_TOKEN: '@face_attend_refresh_token',
  USER_DATA: '@face_attend_user',
  REMEMBER_EMAIL: '@face_attend_remember_email',
};

export const FACE_CONFIG = {
  MIN_CAPTURE_COUNT: 3,
  MAX_CAPTURE_COUNT: 5,
  CAPTURE_INTERVAL_MS: 1200,    // ms between auto-captures
  FACE_BOX_COLOR: '#00D4FF',
  CONFIDENCE_THRESHOLD: 75,     // minimum % for attendance
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
};

export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
};
