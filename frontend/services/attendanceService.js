import {
  attendanceAPI,
} from './api';

// =====================================================
// MARK ATTENDANCE
// =====================================================

export const markAttendance = async (
  attendanceData
) => {

  try {

    const response =
      await attendanceAPI.markAttendance(
        attendanceData
      );

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'Attendance marking failed',
    };
  }
};

// =====================================================
// GET ATTENDANCE HISTORY
// =====================================================

export const getAttendance = async () => {

  try {

    const response =
      await attendanceAPI.getAttendance();

    return {
      success: true,
      data:
        response?.data?.data ||
        response?.data ||
        [],
    };

  } catch (error) {

    console.log(
      'ATTENDANCE ERROR:',
      error?.response?.data
    );

    return {
      success: false,
      data: [],
      message:
        error?.response?.data?.message ||
        'Failed to load attendance',
    };
  }
};

// =====================================================
// TODAY ATTENDANCE
// =====================================================

export const getTodayAttendance =
  async () => {

    try {

      const response =
        await attendanceAPI.getTodayAttendance();

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
        data: {
          check_in: '--',
          status: 'Not Marked',
        },
      };
    }
  };

// =====================================================
// EMPLOYEE REPORT
// =====================================================

export const getMonthlyReport =
  async () => {

    try {

      const response =
        await attendanceAPI.getMyReport();

      console.log(
        'REPORT API:',
        response.data
      );

      return {
        success: true,
        data: response.data,
      };

    } catch (error) {

      console.log(
        'REPORT ERROR:',
        error?.response?.data
      );

      return {
        success: false,
        data: {},
        message:
          error?.response?.data?.message ||
          'Failed to load report',
      };
    }
  };

// =====================================================
// ANALYTICS
// =====================================================

export const getAttendanceAnalytics =
  async () => {

    try {

      const reportResponse =
        await getMonthlyReport();

      const report =
        reportResponse?.data?.data || {};

      const total =
        report.total || 0;

      const present =
        report.present || 0;

      const absent =
        total - present;

      const attendanceRate =
        total > 0
          ? Math.round(
              (present / total) * 100
            )
          : 0;

      return {

        success: true,

        analytics: {

          attendanceRate,

          totalPresent:
            present,

          totalAbsent:
            absent,

          lateEntries:
            report.late || 0,
        },
      };

    } catch (error) {

      return {

        success: false,

        analytics: {

          attendanceRate: 0,
          totalPresent: 0,
          totalAbsent: 0,
          lateEntries: 0,
        },
      };
    }
  };

// =====================================================
// LIVE ATTENDANCE
// =====================================================

export const getLiveAttendance =
  async () => {

    try {

      const response =
        await attendanceAPI.getAttendance();

      return {
        success: true,
        liveData:
          response?.data?.data ||
          response?.data ||
          [],
      };

    } catch (error) {

      return {
        success: false,
        liveData: [],
      };
    }
  };
