/**
 * useAttendance - Custom hook for attendance state management
 */

import { useState, useCallback } from 'react';
import { attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function useAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total_present: 0, working_days: 0, attendance_percentage: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudentAttendance = useCallback(async (month = null) => {
    if (!user?.student_id) return;
    setLoading(true);
    setError(null);
    try {
      const params = month ? { month } : {};
      const res = await attendanceAPI.getStudent(user.student_id, params);
      if (res.data.success) {
        setRecords(res.data.data.records);
        setStats(res.data.data.statistics);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAttendance = useCallback(async (studentId, confidence) => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceAPI.mark({
        student_id: studentId,
        user_id: user?.id,
        confidence,
      });
      if (res.data.success) {
        return { success: true, record: res.data.data.attendance };
      }
      return { success: false, message: res.data.message };
    } catch (e) {
      if (e.response?.status === 409) {
        return {
          success: false,
          alreadyMarked: true,
          message: e.response.data.message,
          record: e.response.data.data?.attendance,
        };
      }
      const msg = e.response?.data?.message || 'Failed to mark attendance';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    records,
    stats,
    loading,
    error,
    fetchStudentAttendance,
    markAttendance,
  };
}
