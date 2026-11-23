import React, {
  useEffect,
} from 'react';

import {
  StatusBar,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

// =====================================
// CONTEXT
// =====================================

import {
  AuthProvider,
} from './context/AuthContext';

import {
  AttendanceProvider,
} from './context/AttendanceContext';

// =====================================
// SERVICES
// =====================================

import {
  registerForPushNotifications,
} from './services/notificationService';

// =====================================
// AUTH
// =====================================

import LoginScreen
from './screens/auth/LoginScreen';

// =====================================
// EMPLOYEE
// =====================================

import EmployeeDashboard
from './screens/employee/EmployeeDashboard';

import AttendanceHistoryScreen
from './screens/employee/AttendanceHistoryScreen';

import FaceAttendanceScreen
from './screens/employee/FaceAttendanceScreen';

import FaceRegisterScreen
from './screens/employee/FaceRegisterScreen';

import LeaveRequestScreen
from './screens/employee/LeaveRequestScreen';


import WFHRequestScreen
from './screens/employee/WFHRequestScreen';

import EmployeeProfileScreen
from './screens/employee/EmployeeProfileScreen';


// =====================================
// ADMIN
// =====================================

import AdminDashboard
from './screens/admin/AdminDashboard';

import AttendanceReportScreen
from './screens/admin/AttendanceReportScreen';

import LiveAttendanceMonitorScreen
from './screens/admin/LiveAttendanceMonitorScreen';

import ManageEmployees
from './screens/admin/ManageEmployees';

import ManageEmployeeScreen
from './screens/admin/ManageEmployeeScreen';

import AdminAnalyticsScreen
from './screens/admin/AdminAnalyticsScreen';

// =====================================
// HR
// =====================================

import HRDashboard
from './screens/hr/HRDashboard';

import AttendanceOverview
from './screens/hr/AttendanceOverview';

import EmployeeManagement
from './screens/hr/EmployeeManagement';

import LeaveApprovalScreen
from './screens/hr/LeaveApprovalScreen';

import LeaveManagement
from './screens/hr/LeaveManagement';

import MonthlyReportScreen
from './screens/hr/MonthlyReportScreen';

import AnalyticsScreen
from './screens/hr/AnalyticsScreen';

import HRFaceRegisterScreen
from './screens/hr/FaceRegisterScreen';

import WFHApprovalScreen 
from './screens/hr/WFHApprovalScreen';

// =====================================
// TEAM LEADER
// =====================================

import TeamLeaderDashboard
from './screens/teamleader/TeamLeaderDashboard';

import TeamDashboard
from './screens/teamleader/TeamDashboard';

import TeamAttendance
from './screens/teamleader/TeamAttendance';

import TeamMembers
from './screens/teamleader/TeamMembers';

import TeamAnalyticsScreen
from './screens/teamleader/TeamAnalyticsScreen';

import TeamReportScreen
from './screens/teamleader/TeamReportScreen';

import TLFaceRegisterScreen
from './screens/teamleader/FaceRegisterScreen';

// =====================================
// STACK
// =====================================

const Stack =
  createNativeStackNavigator();

// =====================================
// APP
// =====================================

export default function App() {

  useEffect(() => {

    registerForPushNotifications();

  }, []);

  return (

    <AuthProvider>

      <AttendanceProvider>

        <NavigationContainer>

          <StatusBar
            barStyle="light-content"
            backgroundColor="#050816"
          />

          <Stack.Navigator

            initialRouteName="Login"

            screenOptions={{

              headerShown: false,

              animation:
                'slide_from_right',
            }}
          >

            {/* ================================= */}
            {/* AUTH */}
            {/* ================================= */}

            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />
            {/* ================================= */}
            {/* EMPLOYEE */}
            {/* ================================= */}

            <Stack.Screen
              name="EmployeeDashboard"
              component={
                EmployeeDashboard
              }
            />

            <Stack.Screen
              name="AttendanceHistory"
              component={
                AttendanceHistoryScreen
              }
            />

            <Stack.Screen
              name="FaceAttendance"
              component={
                FaceAttendanceScreen
              }
            />

            <Stack.Screen
              name="FaceRegister"
              component={
                FaceRegisterScreen
              }
            />

            <Stack.Screen
              name="LeaveRequest"
              component={
                LeaveRequestScreen
              }
            />

            <Stack.Screen
              name="WFHRequest"
              component={
                WFHRequestScreen
              }
            />

            <Stack.Screen
              name="EmployeeProfile"
              component={
                EmployeeProfileScreen
              }
            />
            
            {/* ================================= */}
            {/* ADMIN */}
            {/* ================================= */}

            <Stack.Screen
              name="AdminDashboard"
              component={
                AdminDashboard
              }
            />

            <Stack.Screen
              name="AttendanceReport"
              component={
                AttendanceReportScreen
              }
            />

            <Stack.Screen
              name="LiveAttendanceMonitor"
              component={
                LiveAttendanceMonitorScreen
              }
            />

            <Stack.Screen
              name="ManageEmployees"
              component={
                ManageEmployees
              }
            />

            <Stack.Screen
              name="ManageEmployee"
              component={
                ManageEmployeeScreen
              }
            />

            <Stack.Screen
              name="AdminAnalytics"
              component={
                AdminAnalyticsScreen
              }
            />

            {/* ================================= */}
            {/* HR */}
            {/* ================================= */}

            <Stack.Screen
              name="HRDashboard"
              component={
                HRDashboard
              }
            />

            <Stack.Screen
              name="AttendanceOverview"
              component={
                AttendanceOverview
              }
            />

            <Stack.Screen
              name="EmployeeManagement"
              component={
                EmployeeManagement
              }
            />

            <Stack.Screen
              name="LeaveApproval"
              component={
                LeaveApprovalScreen
              }
            />
            <Stack.Screen
              name="WFHApproval"
              component={
                WFHApprovalScreen
              }
            />

            <Stack.Screen
              name="LeaveManagement"
              component={
                LeaveManagement
              }
            />

            <Stack.Screen
              name="MonthlyReport"
              component={
                MonthlyReportScreen
              }
            />

            <Stack.Screen
              name="Analytics"
              component={
                AnalyticsScreen
              }
            />

            <Stack.Screen
              name="HRFaceRegister"
              component={
                HRFaceRegisterScreen
              }
            />

            {/* ================================= */}
            {/* TEAM LEADER */}
            {/* ================================= */}

            <Stack.Screen
              name="TeamLeaderDashboard"
              component={
                TeamLeaderDashboard
              }
            />

            <Stack.Screen
              name="TeamDashboard"
              component={
                TeamDashboard
              }
            />
            <Stack.Screen
              name="TeamAttendance"
              component={
                TeamAttendance
              }
            />

            <Stack.Screen
              name="TeamMembers"
              component={
                TeamMembers
              }
            />

            <Stack.Screen
              name="TeamAnalytics"
              component={
                TeamAnalyticsScreen
              }
            />

            <Stack.Screen
              name="TeamReport"
              component={
                TeamReportScreen
              }
            />

            <Stack.Screen
              name="TLFaceRegister"
              component={
                TLFaceRegisterScreen
              }
            />

          </Stack.Navigator>

        </NavigationContainer>

      </AttendanceProvider>

    </AuthProvider>
  );
}