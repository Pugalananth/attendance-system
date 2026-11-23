import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  attendanceAPI,
} from '../services/api';

const AttendanceContext = createContext();

export const AttendanceProvider = ({
  children,
}) => {

  const [attendanceList,
    setAttendanceList] = useState([]);

  // ─────────────────────────────
  // LOAD ATTENDANCE
  // ─────────────────────────────

  useEffect(() => {

    fetchAttendance();

  }, []);

  const fetchAttendance = async () => {

    try {

      const response =
        await attendanceAPI.getAttendance();

      const data = response.data;

      if (data.success) {

        setAttendanceList(
          data.attendance
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  // ─────────────────────────────
  // ADD ATTENDANCE
  // ─────────────────────────────

  const addAttendance = async (
    employeeEmail
  ) => {

    try {

      const currentDate =
        new Date().toLocaleDateString();

      const currentTime =
        new Date().toLocaleTimeString();

      const response =
        await attendanceAPI.markAttendance({

          email: employeeEmail,

          date: currentDate,

          time: currentTime,
        });

      const data = response.data;

      if (data.success) {

        fetchAttendance();

        return {
          success: true,
        };
      }

      return {
        success: false,
      };

    } catch (error) {

      console.log(error);

      return {
        success: false,
      };
    }
  };

  return (

    <AttendanceContext.Provider
      value={{
        attendanceList,
        addAttendance,
        fetchAttendance,
      }}
    >

      {children}

    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {

  return useContext(
    AttendanceContext
  );
};