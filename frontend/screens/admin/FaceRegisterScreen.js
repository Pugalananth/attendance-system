/**
 * Enterprise Face Registration Screen
 * AI Employee Face Enrollment
 */

import React, {
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import AsyncStorage from
'@react-native-async-storage/async-storage';

import api from
'../../services/api';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
} from '../../constants/theme';

const TOTAL_CAPTURES = 5;

const CAPTURE_GUIDES = [

  'Look straight',

  'Turn slightly left',

  'Turn slightly right',

  'Tilt face up',

  'Tilt face down',
];

export default function FaceRegisterScreen({
  navigation,
  route,
}) {

  // =====================================================
  // EMPLOYEE
  // =====================================================

  const employee =
    route?.params?.employee;

  // =====================================================
  // CAMERA
  // =====================================================

  const cameraRef =
    useRef(null);

  const [permission,
    requestPermission] =
      useCameraPermissions();

  // =====================================================
  // STATES
  // =====================================================

  const [captures,
    setCaptures] =
      useState([]);

  const [loading,
    setLoading] =
      useState(false);

  const [registering,
    setRegistering] =
      useState(false);

  const [status,
    setStatus] =
      useState(
        'Position your face properly'
      );

  // =====================================================
  // PERMISSION
  // =====================================================

  if (!permission) {

    return (
      <View style={styles.container} />
    );
  }

  if (!permission.granted) {

    return (

      <View style={styles.permissionContainer}>

        <Ionicons
          name="camera-outline"
          size={80}
          color={COLORS.primary}
        />

        <Text style={styles.permissionTitle}>
          Camera Permission Required
        </Text>

        <Text style={styles.permissionText}>
          Allow camera access to register employee face
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >

          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.permissionGradient}
          >

            <Text style={styles.permissionBtnText}>
              Allow Camera
            </Text>

          </LinearGradient>

        </TouchableOpacity>

      </View>
    );
  }

  // =====================================================
  // CAPTURE FACE
  // =====================================================

  const captureFace =
    async () => {

    try {

      if (!cameraRef.current) {

        return;
      }

      setLoading(true);

      const photo =
        await cameraRef.current
          .takePictureAsync({

            quality: 0.7,

            base64: true,

            skipProcessing: false,
          });

      if (!photo?.base64) {

        throw new Error(
          'Image capture failed'
        );
      }

      const updatedCaptures = [

        ...captures,

        photo.base64,
      ];

      setCaptures(
        updatedCaptures
      );

      setStatus(

        `Captured ${updatedCaptures.length} of ${TOTAL_CAPTURES}`
      );

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

      Alert.alert(
        'Error',
        'Face capture failed'
      );
    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetCaptures =
    () => {

    setCaptures([]);

    setStatus(
      'Position your face properly'
    );
  };

  // =====================================================
  // REGISTER FACE
  // =====================================================

  const registerFace =
    async () => {

    try {

      if (!employee) {

        Alert.alert(
          'Error',
          'Employee not selected'
        );

        return;
      }

      if (captures.length < 3) {

        Alert.alert(

          'Minimum Images Required',

          'Capture at least 3 face images'
        );

        return;
      }

      setRegistering(true);

      setStatus(
        'Registering employee face...'
      );

      // ===============================================
      // AUTH USER
      // ===============================================

      const userData =
        await AsyncStorage.getItem(
          'user_data'
        );

      const authUser =
        JSON.parse(userData);

      // ===============================================
      // API REQUEST
      // ===============================================

      const response =
        await api.post(

          '/face-register',

          {

            admin_email:
              authUser.email,

            employee_id:
              employee.employee_id,

            image:
              captures[0],

          }

        );

      const data =
        response.data;

      setRegistering(false);

      // ===============================================
      // SUCCESS
      // ===============================================

      if (data.success) {

        setStatus(
          'Face registered successfully'
        );

        Alert.alert(

          'Success',

          `${employee.name} face registered successfully`,

          [

            {
              text: 'OK',

              onPress: () => {

                navigation.goBack();
              },
            },
          ]
        );

      } else {

        Alert.alert(

          'Registration Failed',

          data.message ||
          'Registration failed'
        );
      }

    } catch (error) {

      console.log(error);

      setRegistering(false);

      Alert.alert(

        'Error',

        error?.response?.data?.message ||

        'Face registration failed'
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <View style={styles.container}>

      {/* CAMERA */}

      <CameraView

        ref={cameraRef}

        style={styles.camera}

        facing="front"
      />

      {/* OVERLAY */}

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>

        {/* HEADER */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.iconButton}
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

          <Text style={styles.headerTitle}>
            Register Face
          </Text>

          <View style={styles.iconButton} />

        </View>

        {/* EMPLOYEE */}

        {employee && (

          <View style={styles.employeeCard}>

            <Text style={styles.employeeName}>
              {employee.name}
            </Text>

            <Text style={styles.employeeMeta}>
              {employee.employee_id}
            </Text>

          </View>

        )}

        {/* SCANNER */}

        <View style={styles.centerArea}>

          <View style={styles.faceCircle}>

            <View style={styles.scanBorder} />

          </View>

        </View>

        {/* BOTTOM */}

        <ScrollView
          style={styles.bottomPanel}
          showsVerticalScrollIndicator={false}
        >

          {/* PROGRESS */}

          <View style={styles.progressCard}>

            <Text style={styles.progressTitle}>
              Face Images Captured
            </Text>

            <Text style={styles.progressCount}>
              {captures.length} / {TOTAL_CAPTURES}
            </Text>

            <View style={styles.progressBar}>

              <View

                style={[

                  styles.progressFill,

                  {
                    width:
                      `${(captures.length / TOTAL_CAPTURES) * 100}%`,
                  },
                ]}
              />

            </View>

          </View>

          {/* GUIDE */}

          <View style={styles.guideCard}>

            <Text style={styles.guideTitle}>
              Current Position
            </Text>

            <Text style={styles.guideText}>

              {
                CAPTURE_GUIDES[
                  captures.length
                ] || 'Completed'
              }

            </Text>

          </View>

          {/* STATUS */}

          <Text style={styles.statusText}>
            {status}
          </Text>

          {/* CAPTURE */}

          {
            captures.length <
            TOTAL_CAPTURES && (

            <TouchableOpacity

              style={styles.captureButton}

              onPress={captureFace}

              disabled={loading}
            >

              <LinearGradient

                colors={
                  loading
                    ? ['#444', '#333']
                    : COLORS.gradientPrimary
                }

                style={styles.captureGradient}
              >

                {
                  loading
                  ? (

                    <ActivityIndicator
                      color="#fff"
                    />

                  ) : (

                    <Ionicons
                      name="camera"
                      size={26}
                      color="#fff"
                    />

                  )
                }

              </LinearGradient>

            </TouchableOpacity>
          )}

          {/* REGISTER */}

          {
            captures.length >= 3 && (

            <TouchableOpacity

              style={styles.registerButton}

              onPress={registerFace}

              disabled={registering}
            >

              <LinearGradient

                colors={
                  registering
                    ? ['#444', '#333']
                    : COLORS.gradientSuccess
                }

                style={styles.registerGradient}
              >

                {
                  registering
                  ? (

                    <ActivityIndicator
                      color="#fff"
                    />

                  ) : (

                    <Ionicons
                      name="shield-checkmark"
                      size={22}
                      color="#fff"
                    />

                  )
                }

                <Text style={styles.registerText}>

                  {
                    registering
                    ? 'Registering Face...'
                    : 'Register Employee Face'
                  }

                </Text>

              </LinearGradient>

            </TouchableOpacity>
          )}

          {/* RESET */}

          {
            captures.length > 0 && (

            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetCaptures}
            >

              <Ionicons
                name="refresh"
                size={18}
                color={COLORS.textMuted}
              />

              <Text style={styles.resetText}>
                Reset Captures
              </Text>

            </TouchableOpacity>
          )}

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(0,0,0,0.55)',
  },

  safeArea: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
  },

  headerTitle: {
    color: '#fff',
    fontSize: FONTS.lg,
    fontWeight: '700',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor:
      'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  employeeCard: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },

  employeeName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  employeeMeta: {
    color: '#CCC',
    marginTop: 4,
  },

  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  faceCircle: {
    width: 260,
    height: 320,
    borderRadius: 160,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanBorder: {
    width: 230,
    height: 290,
    borderRadius: 145,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'dashed',
  },

  bottomPanel: {
    backgroundColor:
      'rgba(10,10,26,0.95)',
    borderTopLeftRadius:
      RADIUS['2xl'],
    borderTopRightRadius:
      RADIUS['2xl'],
    padding: SPACING.xl,
    maxHeight: 350,
  },

  progressCard: {
    marginBottom: SPACING.lg,
  },

  progressTitle: {
    color: COLORS.textSecondary,
    marginBottom: 8,
  },

  progressCount: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: '700',
    marginBottom: 10,
  },

  progressBar: {
    height: 10,
    backgroundColor:
      'rgba(255,255,255,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },

  guideCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  guideTitle: {
    color: COLORS.primary,
    marginBottom: 5,
    fontWeight: '700',
  },

  guideText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.base,
  },

  statusText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  captureButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },

  captureGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },

  registerGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
  },

  registerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FONTS.base,
  },

  resetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  resetText: {
    color: COLORS.textMuted,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    padding: SPACING.xl,
  },

  permissionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.xl,
    fontWeight: '700',
    marginTop: SPACING.lg,
  },

  permissionText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },

  permissionButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },

  permissionGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  permissionBtnText: {
    color: '#fff',
    fontSize: FONTS.base,
    fontWeight: '700',
  },

});