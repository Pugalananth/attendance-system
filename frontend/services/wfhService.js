import { wfhAPI } from './api';

// ─────────────────────────────────────────────
// SUBMIT WFH REQUEST
// ─────────────────────────────────────────────

export const submitWFHRequest =
  async (payload) => {

    try {

      const response =
        await wfhAPI.requestWFH(payload);

      return {

        success: true,

        data: response.data,
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Failed to submit WFH request',
      };
    }
  };

// ─────────────────────────────────────────────
// GET MY WFH REQUESTS
// ─────────────────────────────────────────────

export const getMyWFHRequests =
  async () => {

    try {

      const response =
        await wfhAPI.getMyRequests();

      return {

        success: true,

        data: response.data,
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Failed to load WFH requests',
      };
    }
  };

// ─────────────────────────────────────────────
// CANCEL WFH REQUEST
// ─────────────────────────────────────────────

export const getAllWFHRequests =
  async (status = null) => {

    try {

      const response =
        await wfhAPI.getAllRequests(status);

      const requests =
        response?.data?.data ||
        response?.data?.requests ||
        [];

      return {

        success: true,

        requests,

        data: response.data,
      };

    } catch (error) {

      return {

        success: false,

        requests: [],

        message:

          error?.response?.data
            ?.message ||

          'Failed to load WFH requests',
      };
    }
  };

export const approveWFHRequest =
  async (wfhId) => {

    try {

      const response =
        await wfhAPI.approveRequest(wfhId);

      return {

        success: true,

        message:
          response?.data?.message ||
          'WFH request approved',
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Failed to approve WFH request',
      };
    }
  };

export const rejectWFHRequest =
  async (
    wfhId,
    reason = 'Rejected by HR'
  ) => {

    try {

      const response =
        await wfhAPI.rejectRequest(
          wfhId,
          reason
        );

      return {

        success: true,

        message:
          response?.data?.message ||
          'WFH request rejected',
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Failed to reject WFH request',
      };
    }
  };

export const cancelWFHRequest =
  async (wfhId) => {

    try {

      const response =
        await wfhAPI.cancelRequest(wfhId);

      return {

        success: true,

        message: response.data.message,
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Failed to cancel WFH request',
      };
    }
  };

// ─────────────────────────────────────────────
// GET WFH SUMMARY
// ─────────────────────────────────────────────

export const getWFHSummary =
  async () => {

    try {

      const response =
        await wfhAPI.getSummary();

      return {

        success: true,

        data: response.data,
      };

    } catch (error) {

      return {

        success: false,

        message:

          error?.response?.data
            ?.message ||

          'Failed to load WFH summary',
      };
    }
  };
