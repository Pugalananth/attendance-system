import {
  analyticsAPI,
} from './api';

import {
  employeeAPI,
} from './api';

import {
  attendanceAPI,
} from './api';

// ─────────────────────────────────────────────
// ADMIN ANALYTICS
// ─────────────────────────────────────────────

export const getAdminAnalytics =
  async () => {

    try {

      const response =
        await analyticsAPI.getAdminAnalytics();

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

          'Failed to load analytics',
      };
    }
  };

// ─────────────────────────────────────────────
// LIVE ATTENDANCE
// ─────────────────────────────────────────────

export const getLiveAttendance =
  async () => {

    try {

      const response =
        await attendanceAPI.getTodayAttendance();

      return {

        success: true,

        data:
          response.data,
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Failed to load live attendance',
      };
    }
  };

// ─────────────────────────────────────────────
// COMPANY SETTINGS
// ─────────────────────────────────────────────

export const getCompanySettings =
  async () => {

    try {

      // FUTURE API

      return {

        success: true,

        data: {

          companyName:
            'FaceAttend AI',

          officeTime:
            '09:00 AM - 06:00 PM',

          aiSecurity: true,

          liveness: true,

          notifications: true,
        },
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Settings unavailable',
      };
    }
  };

// ─────────────────────────────────────────────
// SAVE COMPANY SETTINGS
// ─────────────────────────────────────────────

export const saveCompanySettings =
  async (settingsData) => {

    try {

      // FUTURE API SAVE

      return {

        success: true,

        data: settingsData,
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Settings save failed',
      };
    }
  };

// ─────────────────────────────────────────────
// SYSTEM HEALTH
// ─────────────────────────────────────────────

export const getSystemHealth =
  async () => {

    try {

      return {

        success: true,

        data: {

          api: 'Running',

          database: 'Connected',

          aiEngine: 'Active',

          cloudSync: 'Stable',
        },
      };

    } catch (error) {

      return {

        success: false,

        message:

          'System health unavailable',
      };
    }
  };

// ─────────────────────────────────────────────
// DASHBOARD SUMMARY
// ─────────────────────────────────────────────

export const getAdminDashboardSummary =
  async () => {

    try {

      const employees =
        await employeeAPI.getEmployees();

      const attendance =
        await attendanceAPI.getMonthlyReport();

      const employeeList =
        employees.data || [];

      const report =
        attendance.data || {};

      return {

        success: true,

        summary: {

          totalEmployees:
            employeeList.length,

          activeEmployees:
            employeeList.filter(
              (item) =>
                item.status ===
                'Active'
            ).length,

          attendanceRate:
            report.attendance_rate || 0,

          lateEntries:
            report.late_entries || 0,
        },
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Dashboard summary unavailable',
      };
    }
  };