
 //* Enterprise API Service Layer
  //AI Face Attendance System
 //

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

// =====================================================
// BASE URL
// =====================================================

// Configure the active backend in frontend/constants/config.js.
const BASE_URL =
  API_BASE_URL ||
  'http://localhost:5000/api';

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  async (config) => {

    const token = await AsyncStorage.getItem(
      'access_token'
    );

    console.log(
      'TOKEN FROM STORAGE:',
      token
    );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

      console.log(
        'AUTH HEADER:',
        config.headers.Authorization
      );
    }

    console.log(
      'API Request:',
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    return config;
  },

  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

  (response) => {

    console.log(
      'API Response:',
      response.status,
      response.config.url
    );

    return response;
  },

  async (error) => {

    console.log(
      'API ERROR:',
      error?.response?.data ||
      error.message
    );

    if (
      error?.response?.status === 401
    ) {

      console.log(
        'Unauthorized - 401'
      );
    }

    return Promise.reject(error);
  }
);
// =====================================================
// AUTH APIs
// =====================================================

export const authAPI = {

  login: async (
    email,
    password
  ) => {

    return await api.post(
      '/auth/login',
      {
        email,
        password,
      }
    );
  },

  register: async (
    data
  ) => {

    return await api.post(
      '/auth/register',
      data
    );
  },

  setupAdmin: async () => {

    return await api.post(
      '/auth/setup-admin'
    );
  },

  getProfile: async () => {

    return await api.get(
      '/auth/profile'
    );
  },

  verifyToken: async () => {

    return await api.get(
      '/auth/verify'
    );
  },

};

// =====================================================
// ATTENDANCE APIs
// =====================================================

export const attendanceAPI = {

  // =====================================
  // MARK ATTENDANCE
  // =====================================

  markAttendance: async (data) => {

    return await api.post(
      '/attendance/mark',
      data
    );
  },

  // =====================================
  // TODAY ATTENDANCE
  // =====================================

  getTodayAttendance: async () => {

    return await api.get(
      '/attendance/today'
    );
  },

  // =====================================
  // EMPLOYEE ATTENDANCE HISTORY
  // =====================================

  getAttendance: async () => {

    return await api.get(
      '/attendance/my-record'
    );
  },

  getMyAttendance: async () => {

    return await api.get(
      '/attendance/my-record'
    );
  },

  // =====================================
  // EMPLOYEE REPORT
  // =====================================

  getMyReport: async () => {

    return await api.get(
      '/attendance/my-report'
    );
  },

  // =====================================
  // ANALYTICS
  // =====================================

  getAnalytics: async () => {

    return await api.get(
      '/attendance/analytics'
    );
  },

  // =====================================
  // SUMMARY
  // =====================================

  getSummary: async () => {

    return await api.get(
      '/attendance/summary'
    );
  },

  // =====================================
  // LIVE ATTENDANCE
  // =====================================

  getLiveAttendance: async () => {

    return await api.get(
      '/attendance/live'
    );
  },

  // =====================================
  // ADMIN REPORT
  // =====================================

  getReport: async () => {

    return await api.get(
      '/attendance/report'
    );
  },

  getMonthlyReport: async () => {

    return await api.get(
      '/attendance/monthly-report'
    );
  },

  getHRAttendanceOverview: async (
    page = 1,
    limit = 100
  ) => {

    return await api.get(
      '/attendance/overview',
      {
        params: {
          page,
          limit,
        },
      }
    );
  },

  // =====================================
  // EMPLOYEE ATTENDANCE
  // =====================================

  getEmployeeAttendance: async (
    employeeId
  ) => {

    return await api.get(
      `/attendance/employee/${employeeId}`
    );
  },

  // =====================================
  // EXPORT CSV
  // =====================================

  exportCSV: async () => {

    return await api.get(
      '/attendance/export/csv'
    );
  },

};
// =====================================================
// EMPLOYEE APIs
// =====================================================

export const employeeAPI = {

  getEmployees: async () => {

    return await api.get(
      '/employee/employees'
    );
  },
  getProfile: async () => {

    return await api.get(
      '/auth/profile'
    );
  },

  deleteEmployee:
    async (employeeId) => {

    return await api.delete(
      `/employee/employees/${employeeId}`
    );
  },

  approveEmployee:
    async (employeeId) => {

    return await api.post(
      `/employee/employees/${employeeId}/approve`
    );
  },

  rejectEmployee:
    async (employeeId) => {

    return await api.post(
      `/employee/employees/${employeeId}/reject`
    );
  },

  getMyProfile: async () => {
    return await api.get(
      '/employee/profile'
    );
  },

  updateMyProfile: async (data) => {
    return await api.put(
      '/employee/profile',
      data
    );
  },

  getMyStats: async () => {
    return await api.get(
      '/employee/stats'
    );
  },

  getMyDashboard: async () => {
    return await api.get(
      '/employee/dashboard'
    );
  },

  getHRDashboard: async () => {
    return await api.get(
      '/employee/hr-dashboard'
    );
  },

  getHRAnalytics: async () => {
    return await api.get(
      '/employee/hr-analytics'
    );
  },

  getMyActivity: async () => {
    return await api.get(
      '/employee/activity'
    );
  },

};

// =====================================================
// LEAVE APIs
// =====================================================

export const leaveAPI = {

  requestLeave: async (data) => {
    return await api.post(
      '/leave/request',
      data
    );
  },

  getMyLeaveRequests: async () => {
    return await api.get(
      '/leave/my-requests'
    );
  },

  getAllLeaveRequests: async (
    page = 1,
    limit = 50,
    status = null
  ) => {
    return await api.get(
      '/leave/all',
      {
        params: {
          page,
          limit,
          ...(status && { status }),
        },
      }
    );
  },

  approveLeave: async (leaveId) => {
    return await api.post(
      `/leave/approve/${leaveId}`
    );
  },

  rejectLeave: async (
    leaveId,
    rejectionReason
  ) => {
    return await api.post(
      `/leave/reject/${leaveId}`,
      { rejection_reason: rejectionReason }
    );
  },

  cancelLeave: async (leaveId) => {
    return await api.post(
      `/leave/cancel/${leaveId}`
    );
  },

  getLeaveSummary: async () => {
    return await api.get(
      '/leave/summary'
    );
  },

};

// =====================================================
// FACE APIs
// =====================================================

export const faceAPI = {

  registerFace:
    async (data) => {

    return await api.post(
      '/face/register',
      data,
      {
        timeout: 120000,
      }
    );
  },

  verifyFace:
    async (data) => {

    return await api.post(
      '/face/verify',
      data,
      {
        timeout: 120000,
      }
    );
  },

};


// =====================================================
// WFH APIs
// =====================================================

export const wfhAPI = {

  requestWFH:
    async (payload) => {

    return await api.post(
      '/wfh/request',
      payload
    );
  },

  getMyRequests:
    async () => {

    return await api.get(
      '/wfh/my-requests'
    );
  },

  getAllRequests:
    async (status = null) => {

    return await api.get(
      '/wfh/all',
      {
        params: {
          ...(status && { status }),
        },
      }
    );
  },

  approveRequest:
    async (wfhId) => {

    return await api.post(
      `/wfh/approve/${wfhId}`
    );
  },

  rejectRequest:
    async (wfhId, reason) => {

    return await api.post(
      `/wfh/reject/${wfhId}`,
      { reason }
    );
  },

  cancelRequest:
    async (wfhId) => {

    return await api.post(
      `/wfh/cancel/${wfhId}`
    );
  },

  getSummary:
    async () => {

    return await api.get(
      '/wfh/summary'
    );
  },

};


// =====================================================
// EXPORT
// =====================================================

export default api;
