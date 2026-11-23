import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import AsyncStorage from
'@react-native-async-storage/async-storage';

import {

  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

import {
  faceAPI,
  AttendanceAPI,
} from '../../services/api';

export default function FaceAttendanceScreen({

  navigation,

}) {

  // =====================================
  // STATES
  // =====================================

  const [permission,
    requestPermission] =
      useCameraPermissions();

  const [loading,
    setLoading] =
      useState(false);

  const [cameraReady,
    setCameraReady] =
      useState(false);

  const [aiStatus,
    setAiStatus] =
      useState(
        'AI Face Detection Active'
      );

  const [verificationStatus,
    setVerificationStatus] =
      useState(null);

  const cameraRef =
    useRef(null);

  // =====================================
  // SCAN ANIMATION
  // =====================================

  const scanAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {

    Animated.loop(

      Animated.sequence([

        Animated.timing(
          scanAnim,
          {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          scanAnim,
          {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }
        ),

      ])

    ).start();

  }, []);

  // =====================================
  // CAMERA PERMISSION
  // =====================================

  if (!permission) {

    return (
      <View />
    );
  }

  if (!permission.granted) {

    return (

      <View style={styles.permissionContainer}>

        <Ionicons
          name="camera"
          size={70}
          color={COLORS.primary}
        />

        <Text style={styles.permissionTitle}>
          Camera Permission Required
        </Text>

        <Text style={styles.permissionSubtitle}>
          Enable camera access for AI attendance verification
        </Text>

        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >

          <Text style={styles.permissionBtnText}>
            Grant Permission
          </Text>

        </TouchableOpacity>

      </View>
    );
  }

  // =====================================
  // MARK ATTENDANCE
  // =====================================

  const markAttendance =
    async () => {

    try {

      setLoading(true);

      setVerificationStatus(
        null
      );

      setAiStatus(
        'Scanning face...'
      );

      const userData =
        await AsyncStorage.getItem(
          'user_data'
        );

      const user =
        JSON.parse(userData);

      if (!cameraRef.current) {

        Alert.alert(
          'Error',
          'Camera not ready'
        );

        setLoading(false);

        return;
      }

      // TAKE PHOTO

      const photo =
        await cameraRef.current.takePictureAsync({

          base64: true,

          quality: 0.6,
        });

      setAiStatus(
        'AI verification processing...'
      );

      // VERIFY FACE

      const response =
        await faceAPI.verifyFace({

          employee_id:
            user?.employee_id,

          image:
            photo.base64,
        });
    
      const data =
        response.data;

      setLoading(false);

      // SUCCESS

      if (
        data?.success &&
        data?.verified
      ) {

        await attendanceAPI.markAttendance({

          employee_id:
            user?.employee_id,

          confidence:
            data?.data?.confidence || 95,

          location:
            'Mobile App',
        });

        setVerificationStatus(
          'success'
        );

        setAiStatus(
          'Attendance marked successfully'
        );

        Alert.alert(
          'Success',
          'Attendance marked successfully'
        );

      }
       else {

        setVerificationStatus(
          'failed'
        );

        setAiStatus(
          'Face verification failed'
        );

        Alert.alert(
          'Verification Failed',

          data?.message ||

          'Face not recognized'
        );
      }

    } catch (error) {

      console.log(error);

      setLoading(false);

      setVerificationStatus(
        'failed'
      );

      setAiStatus(
        'Attendance failed'
      );

      Alert.alert(
        'Error',
        'AI attendance verification failed'
      );
    }
  };

  // =====================================
  // STATUS COLOR
  // =====================================

  const getStatusColor =
    () => {

    if (
      verificationStatus ===
      'success'
    ) {

      return COLORS.success;
    }

    if (
      verificationStatus ===
      'failed'
    ) {

      return COLORS.error;
    }

    return '#00D097';
  };

  // =====================================
  // UI
  // =====================================

  return (

    <View style={styles.container}>

      {/* CAMERA */}

      <CameraView

        ref={cameraRef}

        style={StyleSheet.absoluteFill}

        facing="front"

        onCameraReady={() =>
          setCameraReady(true)
        }
      />

      {/* DARK OVERLAY */}

      <LinearGradient

        colors={[
          'rgba(0,0,0,0.88)',
          'rgba(0,0,0,0.30)',
          'rgba(0,0,0,0.88)',
        ]}

        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>

        {/* HEADER */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() =>
              navigation.goBack()
            }
          >

            <Ionicons
              name="arrow-back"
              size={24}
              color="#fff"
            />

          </TouchableOpacity>

          <Text style={styles.title}>
            AI Face Attendance
          </Text>

          <Text style={styles.subtitle}>
            Enterprise face verification system
          </Text>

        </View>

        {/* CENTER */}

        <View style={styles.centerContainer}>

          {/* FACE FRAME */}

          <View style={styles.faceFrame}>

            {/* CORNERS */}

            <View
              style={[
                styles.corner,
                styles.topLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.topRight,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.bottomLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.bottomRight,
              ]}
            />

            {/* SCAN LINE */}

            <Animated.View

              style={[

                styles.scanLine,

                {
                  transform: [

                    {
                      translateY:
                        scanAnim.interpolate({

                          inputRange: [0, 1],

                          outputRange:
                            [-120, 120],
                        }),
                    },
                  ],
                },
              ]}
            />

            {/* AI ICON */}

            <View style={styles.aiCenter}>

              <Ionicons
                name="scan-circle"
                size={70}
                color="#00E0FF"
              />

            </View>

          </View>

        </View>

        {/* AI STATUS */}

        <View style={styles.statusContainer}>

          <View
            style={[
              styles.statusDot,

              {
                backgroundColor:
                  getStatusColor(),
              },
            ]}
          />

          <Text style={styles.statusText}>
            {aiStatus}
          </Text>

        </View>

        {/* SECURITY INFO */}

        <View style={styles.securityContainer}>

          <SecurityItem
            icon="shield-checkmark"
            text="Anti-spoof AI protection"
          />

          <SecurityItem
            icon="eye"
            text="Live liveness detection"
          />

          <SecurityItem
            icon="scan"
            text="Enterprise face verification"
          />

        </View>

        {/* BUTTON */}

        <View style={styles.bottomContainer}>

          <TouchableOpacity

            activeOpacity={0.9}

            style={styles.scanButton}

            onPress={markAttendance}

            disabled={
              loading ||
              !cameraReady
            }
          >

            <LinearGradient

              colors={
                verificationStatus ===
                'success'

                ? COLORS.gradientSuccess

                : COLORS.gradientPrimary
              }

              style={styles.scanGradient}
            >

              {
                loading ? (

                  <>

                    <ActivityIndicator
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.scanText
                      }
                    >
                      AI Verification...
                    </Text>

                  </>

                ) : (

                  <>

                    <Ionicons

                      name={
                        verificationStatus ===
                        'success'

                        ? 'checkmark-circle'

                        : 'scan'
                      }

                      size={30}

                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.scanText
                      }
                    >
                      {
                        verificationStatus ===
                        'success'

                        ? 'Attendance Verified'

                        : 'Verify & Mark Attendance'
                      }
                    </Text>

                  </>
                )
              }

            </LinearGradient>

          </TouchableOpacity>

        </View>

      </SafeAreaView>

    </View>
  );
}

/* ===================================== */
/* SECURITY ITEM */
/* ===================================== */

function SecurityItem({

  icon,
  text,

}) {

  return (

    <View style={styles.securityItem}>

      <Ionicons
        name={icon}
        size={18}
        color="#00FFB2"
      />

      <Text style={styles.securityText}>
        {text}
      </Text>

    </View>
  );
}

/* ===================================== */
/* STYLES */
/* ===================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  permissionContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 30,

    backgroundColor: COLORS.bg,
  },

  permissionTitle: {

    color: COLORS.textPrimary,

    fontSize: 24,

    fontWeight: '800',

    marginTop: 24,
  },

  permissionSubtitle: {

    color: COLORS.textSecondary,

    marginTop: 12,

    textAlign: 'center',

    lineHeight: 24,
  },

  permissionBtn: {

    backgroundColor: COLORS.primary,

    paddingHorizontal: 28,

    paddingVertical: 16,

    borderRadius: 18,

    marginTop: 30,
  },

  permissionBtnText: {

    color: '#FFFFFF',

    fontWeight: '700',

    fontSize: 15,
  },

  header: {

    alignItems: 'center',

    marginTop: 10,
  },

  backBtn: {

    position: 'absolute',

    left: 20,

    top: 0,

    width: 46,

    height: 46,

    borderRadius: 14,

    backgroundColor: 'rgba(255,255,255,0.12)',

    justifyContent: 'center',

    alignItems: 'center',
  },

  title: {

    color: '#FFFFFF',

    fontSize: 30,

    fontWeight: '800',
  },

  subtitle: {

    color: '#CCCCCC',

    marginTop: 8,

    fontSize: 15,
  },

  centerContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  faceFrame: {

    width: 270,

    height: 340,

    borderRadius: 36,

    borderWidth: 2,

    borderColor: 'rgba(255,255,255,0.15)',

    overflow: 'hidden',

    justifyContent: 'center',

    alignItems: 'center',
  },

  aiCenter: {

    justifyContent: 'center',

    alignItems: 'center',
  },

  corner: {

    position: 'absolute',

    width: 45,

    height: 45,

    borderColor: '#00E0FF',
  },

  topLeft: {

    top: 0,

    left: 0,

    borderTopWidth: 5,

    borderLeftWidth: 5,

    borderTopLeftRadius: 24,
  },

  topRight: {

    top: 0,

    right: 0,

    borderTopWidth: 5,

    borderRightWidth: 5,

    borderTopRightRadius: 24,
  },

  bottomLeft: {

    bottom: 0,

    left: 0,

    borderBottomWidth: 5,

    borderLeftWidth: 5,

    borderBottomLeftRadius: 24,
  },

  bottomRight: {

    bottom: 0,

    right: 0,

    borderBottomWidth: 5,

    borderRightWidth: 5,

    borderBottomRightRadius: 24,
  },

  scanLine: {

    position: 'absolute',

    width: '100%',

    height: 4,

    backgroundColor: '#00E0FF',

    shadowColor: '#00E0FF',

    shadowOpacity: 1,

    shadowRadius: 12,

    elevation: 10,
  },

  statusContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 18,
  },

  statusDot: {

    width: 10,

    height: 10,

    borderRadius: 10,

    marginRight: 8,
  },

  statusText: {

    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '600',
  },

  securityContainer: {

    marginHorizontal: 24,

    marginBottom: 24,

    backgroundColor: 'rgba(255,255,255,0.06)',

    borderRadius: 24,

    padding: 20,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.08)',
  },

  securityItem: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 16,
  },

  securityText: {

    color: '#FFFFFF',

    marginLeft: 12,

    fontSize: 14,
  },

  bottomContainer: {

    paddingHorizontal: 24,

    paddingBottom: 40,
  },

  scanButton: {

    borderRadius: 24,

    overflow: 'hidden',
  },

  scanGradient: {

    paddingVertical: 20,

    borderRadius: 24,

    alignItems: 'center',

    justifyContent: 'center',
  },

  scanText: {

    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '700',

    marginTop: 10,
  },

});