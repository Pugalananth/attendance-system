import {
  leaveAPI,
} from './api';

import {
  attendanceAPI,
} from './api';

import {
  employeeAPI,
} from './api';

// ─────────────────────────────────────────────
// GET LEAVE REQUESTS
// ─────────────────────────────────────────────

export const getLeaveRequests =
  async () => {

    try {

      const response =
        await leaveAPI.getAllLeaveRequests();

      const leaves =
        response?.data?.data?.records ||
        response?.data?.records ||
        response?.data?.data ||
        [];

      return {

        success: true,

        leaves,

        data:
          response.data,
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Failed to load leave requests',
      };
    }
  };

// ─────────────────────────────────────────────
// APPLY LEAVE
// ─────────────────────────────────────────────

export const applyLeave =
  async (leaveData) => {

    try {

      const response =
        await leaveAPI.requestLeave(
          leaveData
        );

      return {

        success: true,

        data:
          response?.data?.data ||
          response?.data ||
          {},
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Leave request failed',
      };
    }
  };

// ─────────────────────────────────────────────
// APPROVE LEAVE
// ─────────────────────────────────────────────

export const approveLeave =
  async (leaveId) => {

    try {

      const response =
        await leaveAPI.approveLeave(
          leaveId
        );

      return {

        success: true,

        data:
          response?.data?.data ||
          response?.data ||
          {},
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Leave approval failed',
      };
    }
  };

// ─────────────────────────────────────────────
// REJECT LEAVE
// ─────────────────────────────────────────────

export const rejectLeave =
  async (leaveId) => {

    try {

      const response =
        await leaveAPI.rejectLeave(
          leaveId
        );

      return {

        success: true,

        data:
          response.data,
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Leave rejection failed',
      };
    }
  };

// ─────────────────────────────────────────────
// HR ANALYTICS
// ─────────────────────────────────────────────

export const getHRAnalytics =
  async () => {

    try {

      let response;

      try {

        response =
          await employeeAPI.getHRAnalytics();

      } catch (analyticsError) {

        console.log(
          'HR ANALYTICS FALLBACK:',
          analyticsError?.response?.data ||
          analyticsError.message
        );

        response =
          await employeeAPI.getHRDashboard();
      }

      const report =
        response?.data?.data ||
        response?.data?.analytics ||
        response?.data ||
        {};

      return {

        success: true,

        analytics: {

          totalEmployees:
            report.totalEmployees ||
            report.total_employees ||
            0,

          attendanceRate:
            report.attendanceRate ||
            report.attendance_rate ||
            0,

          presentEmployees:
            report.presentEmployees ||
            report.present_employees ||
            report.present ||
            0,

          absentEmployees:
            report.absentEmployees ||
            report.absent_employees ||
            report.absent ||
            0,

          pendingLeaves:
            report.pendingLeaves ||
            report.pending_leaves ||
            0,

          pendingWFH:
            report.pendingWFH ||
            report.pending_wfh ||
            0,

          lateEntries:
            report.lateEntries ||
            report.late_entries ||
            report.late ||
            0,

          aiAccuracy:
            report.aiAccuracy ||
            report.ai_accuracy ||
            98,

          spoofAttempts:
            report.spoofAttempts ||
            report.spoof_attempts ||
            0,

          blinkVerification:
            report.blinkVerification ??
            report.blink_verification ??
            true,

          departments:
            report.departments ||
            [],
        },
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Failed to load HR analytics',
      };
    }
  };

// ─────────────────────────────────────────────
// MONTHLY REPORT
// ─────────────────────────────────────────────

export const getMonthlyReport =
  async () => {

    try {

      const response =
        await attendanceAPI.getMonthlyReport();

      return {

        success: true,

        data:
          response.data,
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Monthly report unavailable',
      };
    }
  };

// ─────────────────────────────────────────────
// ATTENDANCE REPORT
// ─────────────────────────────────────────────

export const getAttendanceReport =
  async () => {

    try {

      let response;

      try {

        response =
          await attendanceAPI
            .getHRAttendanceOverview();

      } catch (overviewError) {

        console.log(
          'HR OVERVIEW FALLBACK:',
          overviewError?.response?.data ||
          overviewError.message
        );

        response =
          await attendanceAPI.getReport();
      }

      const records =
        response?.data?.data?.records ||
        response?.data?.records ||
        response?.data?.data ||
        [];

      return {

        success: true,

        records,

        data:
          response.data,
      };

    } catch (error) {

      console.log(
        'HR ATTENDANCE OVERVIEW ERROR:',
        error?.response?.data ||
        error.message
      );

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Attendance report unavailable',
      };
    }
  };

// ─────────────────────────────────────────────
// HR DASHBOARD SUMMARY
// ─────────────────────────────────────────────

export const getHRDashboardSummary =
  async () => {

    try {

      const response =
        await employeeAPI.getHRDashboard();

      const summary =
        response?.data?.data ||
        response?.data?.summary ||
        {};

      return {

        success: true,

        summary,
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Dashboard summary unavailable',
      };
    }
  };
