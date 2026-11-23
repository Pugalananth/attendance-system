import {
  employeeAPI,
} from './api';

// ─────────────────────────────────────────────
// GET EMPLOYEES
// ─────────────────────────────────────────────

export const getEmployees =
  async () => {

    try {

      const response =
        await employeeAPI.getEmployees();

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

          'Failed to load employees',
      };
    }
  };

// ─────────────────────────────────────────────
// DELETE EMPLOYEE
// ─────────────────────────────────────────────

export const deleteEmployee =
  async (employeeId) => {

    try {

      const response =
        await employeeAPI.deleteEmployee(
          employeeId
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

          'Employee deletion failed',
      };
    }
  };

// ─────────────────────────────────────────────
// APPROVE EMPLOYEE
// ─────────────────────────────────────────────

export const approveEmployee =
  async (employeeId) => {

    try {

      const response =
        await employeeAPI.approveEmployee(
          employeeId
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

          'Employee approval failed',
      };
    }
  };

// ─────────────────────────────────────────────
// GET EMPLOYEE PROFILE
// ─────────────────────────────────────────────

export const getEmployeeProfile =
  async (employeeId) => {

    try {

      const employees =
        await employeeAPI.getEmployees();

      const employee =
        employees.data?.find(
          (item) =>
            item._id === employeeId
        );

      return {

        success: true,

        data: employee,
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Failed to load profile',
      };
    }
  };

// ─────────────────────────────────────────────
// EMPLOYEE ANALYTICS
// ─────────────────────────────────────────────

export const getEmployeeAnalytics =
  async () => {

    try {

      const response =
        await employeeAPI.getEmployees();

      const employees =
        response.data || [];

      const totalEmployees =
        employees.length;

      const activeEmployees =
        employees.filter(
          (item) =>
            item.status === 'Active'
        ).length;

      const inactiveEmployees =
        employees.filter(
          (item) =>
            item.status === 'Inactive'
        ).length;

      return {

        success: true,

        analytics: {

          totalEmployees,

          activeEmployees,

          inactiveEmployees,
        },
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Analytics loading failed',
      };
    }
  };

// ─────────────────────────────────────────────
// SEARCH EMPLOYEE
// ─────────────────────────────────────────────

export const searchEmployees =
  async (keyword) => {

    try {

      const response =
        await employeeAPI.getEmployees();

      const employees =
        response.data || [];

      const filtered =
        employees.filter((item) =>

          item.name
            ?.toLowerCase()
            .includes(
              keyword.toLowerCase()
            )
        );

      return {

        success: true,

        data: filtered,
      };

    } catch (error) {

      return {

        success: false,

        message:

          'Employee search failed',
      };
    }
  };

// ─────────────────────────────────────────────
// GET MY PROFILE (Current User)
// ─────────────────────────────────────────────

export const getMyProfile = async () => {

  try {

    const response =
      await employeeAPI.getMyProfile();

    return {
      success: true,
      data: response?.data?.data || {},
    };

  } catch (error) {

    console.log(
      'MY PROFILE ERROR:',
      error?.response?.data
    );

    return {
      success: false,
      data: {},
      message:
        error?.response?.data?.message ||
        'Failed to load profile',
    };
  }
};

// ─────────────────────────────────────────────
// UPDATE MY PROFILE
// ─────────────────────────────────────────────

export const updateMyProfile = async (
  profileData
) => {

  try {

    const response =
      await employeeAPI.updateMyProfile(
        profileData
      );

    return {
      success: true,
      message: 'Profile updated successfully',
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'Failed to update profile',
    };
  }
};

// ─────────────────────────────────────────────
// GET MY STATS
// ─────────────────────────────────────────────

export const getMyStats = async () => {

  try {

    const response =
      await employeeAPI.getMyStats();

    return {
      success: true,
      data: response?.data?.data || {
        attendance: {
          total: 0,
          present: 0,
          late: 0,
          percentage: 0,
        },
        leaves: {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
        },
      },
    };

  } catch (error) {

    console.log(
      'STATS ERROR:',
      error?.response?.data
    );

    return {
      success: false,
      data: {
        attendance: {
          total: 0,
          present: 0,
          late: 0,
          percentage: 0,
        },
        leaves: {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
        },
      },
      message:
        error?.response?.data?.message ||
        'Failed to load statistics',
    };
  }
};

// ─────────────────────────────────────────────
// GET MY DASHBOARD
// ─────────────────────────────────────────────

export const getMyDashboard = async () => {

  try {

    const response =
      await employeeAPI.getMyDashboard();

    return {
      success: true,
      data: response?.data?.data || {},
    };

  } catch (error) {

    console.log(
      'DASHBOARD ERROR:',
      error?.response?.data
    );

    return {
      success: false,
      data: {},
      message:
        error?.response?.data?.message ||
        'Failed to load dashboard',
    };
  }
};

// ─────────────────────────────────────────────
// GET MY ACTIVITY
// ─────────────────────────────────────────────

export const getMyActivity = async () => {

  try {

    const response =
      await employeeAPI.getMyActivity();

    return {
      success: true,
      data: response?.data?.data || {
        recent_attendance: [],
        recent_leaves: [],
      },
    };

  } catch (error) {

    console.log(
      'ACTIVITY ERROR:',
      error?.response?.data
    );

    return {
      success: false,
      data: {
        recent_attendance: [],
        recent_leaves: [],
      },
      message:
        error?.response?.data?.message ||
        'Failed to load activity',
    };
  }
};