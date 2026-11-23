import * as Notifications from
'expo-notifications';

import Constants from
'expo-constants';

import {
  Platform,
} from 'react-native';

// =========================================
// NOTIFICATION HANDLER
// =========================================

Notifications.setNotificationHandler({

  handleNotification:
    async () => ({

      shouldShowAlert: true,

      shouldPlaySound: true,

      shouldSetBadge: true,
    }),
});

// =========================================
// REGISTER DEVICE
// =========================================

export const registerForPushNotifications =
  async () => {

    try {

      let token;

      // PHYSICAL DEVICE CHECK

      if (
        Constants.isDevice
      ) {

        const {

          status:
            existingStatus,

        } =
          await Notifications.getPermissionsAsync();

        let finalStatus =
          existingStatus;

        // REQUEST PERMISSION

        if (
          existingStatus !==
          'granted'
        ) {

          const {

            status,

          } =
            await Notifications.requestPermissionsAsync();

          finalStatus =
            status;
        }

        // PERMISSION DENIED

        if (
          finalStatus !==
          'granted'
        ) {

          console.log(
            'Notification permission denied'
          );

          return null;
        }

        // EXPO TOKEN

        token =
          (
            await Notifications.getExpoPushTokenAsync()
          ).data;

        console.log(
          'Push Token:',
          token
        );

      } else {

        console.log(
          'Must use physical device'
        );
      }

      // ANDROID CHANNEL

      if (
        Platform.OS ===
        'android'
      ) {

        Notifications.setNotificationChannelAsync(

          'default',

          {

            name:
              'default',

            importance:
              Notifications.AndroidImportance.MAX,

            vibrationPattern: [
              0,
              250,
              250,
              250,
            ],

            lightColor:
              '#4F8EF7',
          }
        );
      }

      return token;

    } catch (error) {

      console.log(
        'Notification Error:',
        error
      );

      return null;
    }
  };

// =========================================
// SIMPLE NOTIFICATION
// =========================================

export const sendLocalNotification =
  async (

    title,

    body,

    data = {}

  ) => {

    try {

      await Notifications.scheduleNotificationAsync({

        content: {

          title,

          body,

          data,

          sound: true,
        },

        trigger: null,
      });

    } catch (error) {

      console.log(error);
    }
  };

// =========================================
// ATTENDANCE SUCCESS
// =========================================

export const showAttendanceSuccessNotification =
  async () => {

    await sendLocalNotification(

      'Attendance Marked',

      'Your attendance has been successfully verified using AI face recognition.',

      {

        type:
          'attendance_success',
      }
    );
  };

// =========================================
// ATTENDANCE FAILURE
// =========================================

export const showAttendanceFailureNotification =
  async () => {

    await sendLocalNotification(

      'Attendance Failed',

      'AI face verification failed. Please try again.',

      {

        type:
          'attendance_failed',
      }
    );
  };

// =========================================
// LEAVE APPROVED
// =========================================

export const showLeaveApprovedNotification =
  async () => {

    await sendLocalNotification(

      'Leave Approved',

      'Your leave request has been approved by HR.',

      {
        type:
          'leave_approved',
      }
    );
  };

// =========================================
// LEAVE REJECTED
// =========================================

export const showLeaveRejectedNotification =
  async () => {

    await sendLocalNotification(

      'Leave Rejected',

      'Your leave request was rejected by HR.',

      {
        type:
          'leave_rejected',
      }
    );
  };

// =========================================
// ADMIN ALERT
// =========================================

export const showAdminAlertNotification =
  async (

    message

  ) => {

    await sendLocalNotification(

      'Admin Alert',

      message,

      {
        type:
          'admin_alert',
      }
    );
  };

// =========================================
// HR ALERT
// =========================================

export const showHRNotification =
  async (

    message

  ) => {

    await sendLocalNotification(

      'HR Notification',

      message,

      {
        type:
          'hr_alert',
      }
    );
  };