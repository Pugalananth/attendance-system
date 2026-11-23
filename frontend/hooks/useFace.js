/**
 * useFace - Custom hook for face recognition operations
 */

import { useState, useCallback } from 'react';
import { faceAPI } from '../services/api';

export function useFace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerFace = useCallback(async (studentId, userId, images) => {
    setLoading(true);
    setError(null);
    try {
      const res = await faceAPI.register(studentId, userId, images);
      if (res.data.success) {
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message };
    } catch (e) {
      const msg = e.response?.data?.message || 'Face registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyFace = useCallback(async (imageBase64, studentId = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await faceAPI.verify(imageBase64, studentId);
      if (res.data.success && res.data.verified) {
        return {
          success: true,
          verified: true,
          student: res.data.data.student,
          confidence: res.data.data.confidence,
          livenessScore: res.data.data.liveness_score,
        };
      }
      return {
        success: res.data.success,
        verified: false,
        message: res.data.message,
      };
    } catch (e) {
      const msg = e.response?.data?.message || 'Face verification failed';
      setError(msg);
      return { success: false, verified: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkFaceStatus = useCallback(async (studentId) => {
    try {
      const res = await faceAPI.getStatus(studentId);
      return res.data.data;
    } catch {
      return { registered: false };
    }
  }, []);

  return { loading, error, registerFace, verifyFace, checkFaceStatus };
}
