import {
  leaveAPI,
} from './api';

// =====================================================
// REQUEST LEAVE
// =====================================================

export const submitLeaveRequest = async (
  leaveData
) => {

  try {

    const response =
      await leaveAPI.requestLeave(
        leaveData
      );

    return {
      success: true,
      message: 'Leave request submitted successfully',
      data: response.data?.data,
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'Failed to submit leave request',
    };
  }
};

// =====================================================
// GET MY LEAVE REQUESTS
// =====================================================

export const getMyLeaveRequests = async () => {

  try {

    const response =
      await leaveAPI.getMyLeaveRequests();

    return {
      success: true,
      data:
        response?.data?.data ||
        [],
    };

  } catch (error) {

    console.log(
      'LEAVE ERROR:',
      error?.response?.data
    );

    return {
      success: false,
      data: [],
      message:
        error?.response?.data?.message ||
        'Failed to load leave requests',
    };
  }
};

// =====================================================
// GET LEAVE SUMMARY
// =====================================================

export const getLeaveSummary =
  async () => {

    try {

      const response =
        await leaveAPI.getLeaveSummary();

      return {
        success: true,
        data:
          response?.data?.data ||
          {
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          },
      };

    } catch (error) {

      return {
        success: false,
        data: {
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
        },
        message:
          error?.response?.data?.message ||
          'Failed to load leave summary',
      };
    }
  };

// =====================================================
// CANCEL LEAVE REQUEST
// =====================================================

export const cancelLeaveRequest = async (
  leaveId
) => {

  try {

    const response =
      await leaveAPI.cancelLeave(leaveId);

    return {
      success: true,
      message: 'Leave request cancelled successfully',
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'Failed to cancel leave request',
    };
  }
};

// =====================================================
// GET ALL LEAVE REQUESTS (ADMIN/HR)
// =====================================================

export const getAllLeaveRequests = async (
  page = 1,
  limit = 50,
  status = null
) => {

  try {

    const response =
      await leaveAPI.getAllLeaveRequests(
        page,
        limit,
        status
      );

    return {
      success: true,
      data: response?.data?.data || {
        records: [],
        pagination: {},
      },
    };

  } catch (error) {

    return {
      success: false,
      data: {
        records: [],
        pagination: {},
      },
      message:
        error?.response?.data?.message ||
        'Failed to load leave requests',
    };
  }
};

// =====================================================
// APPROVE LEAVE REQUEST (ADMIN/HR)
// =====================================================

export const approveLeaveRequest = async (
  leaveId
) => {

  try {

    const response =
      await leaveAPI.approveLeave(leaveId);

    return {
      success: true,
      message: 'Leave request approved successfully',
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'Failed to approve leave request',
    };
  }
};

// =====================================================
// REJECT LEAVE REQUEST (ADMIN/HR)
// =====================================================

export const rejectLeaveRequest = async (
  leaveId,
  rejectionReason = ''
) => {

  try {

    const response =
      await leaveAPI.rejectLeave(
        leaveId,
        rejectionReason
      );

    return {
      success: true,
      message: 'Leave request rejected successfully',
    };

  } catch (error) {

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        'Failed to reject leave request',
    };
  }
};
