import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
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

import {
  faceAPI,
} from '../../services/api';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
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

}) {

  // =====================================
  // STATES
  // =====================================

  const cameraRef =
    useRef(null);

  const [permission,
    requestPermission] =
      useCameraPermissions();

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
        'AI face enrollment ready'
      );

  const [aiStatus,
    setAiStatus] =
      useState(
        'Waiting for capture'
      );

  // =====================================
  // ANIMATION
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
      <View style={styles.container} />
    );
  }

  if (!permission.granted) {

    return (

      <View style={styles.permissionContainer}>

        <Ionicons
          name="camera"
          size={80}
          color={COLORS.primary}
        />

        <Text style={styles.permissionTitle}>
          Camera Permission Required
        </Text>

        <Text style={styles.permissionText}>
          Enable camera access for secure AI face registration
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
              Grant Permission
            </Text>

          </LinearGradient>

        </TouchableOpacity>

      </View>
    );
  }

  // =====================================
  // CAPTURE FACE
  // =====================================

  const captureFace =
    async () => {

    try {

      if (!cameraRef.current) {

        return;
      }

      setLoading(true);

      setAiStatus(
        'Capturing face...'
      );

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

      setAiStatus(
        'Face captured successfully'
      );

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

      setAiStatus(
        'Capture failed'
      );

      Alert.alert(
        'Error',
        'AI face capture failed'
      );
    }
  };

  // =====================================
  // RESET
  // =====================================

  const resetCaptures =
    () => {

    setCaptures([]);

    setStatus(
      'AI face enrollment ready'
    );

    setAiStatus(
      'Waiting for capture'
    );
  };

  // =====================================
  // REGISTER FACE
  // =====================================

  const registerFace =
    async () => {

    try {

      if (captures.length < 3) {

        Alert.alert(

          'Minimum Images Required',

          'Capture at least 3 face images'
        );

        return;
      }

      setRegistering(true);

      setAiStatus(
        'AI face enrollment processing...'
      );

      // USER

      const user =
        JSON.parse(

          await AsyncStorage.getItem(
            'user_data'
          )
        );

      if (!user?.email) {

        throw new Error(
          'User session missing'
        );
      }

      // REGISTER FACE

      const response =
        await faceAPI.registerFace({

          email:
            user.email,

          image:
            captures[0],
        });

      const data =
        response.data;

      setRegistering(false);

      // SUCCESS

      if (data.success) {

        setAiStatus(
          'AI enrollment completed'
        );

        setStatus(
          'Face registered successfully'
        );

        Alert.alert(

          'Registration Success',

          'Employee face registered successfully',

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

        setAiStatus(
          'Registration failed'
        );

        Alert.alert(

          'Registration Failed',

          data.message ||
          'Registration failed'
        );
      }

    } catch (error) {

      console.log(error);

      setRegistering(false);

      setAiStatus(
        'Enrollment failed'
      );

      Alert.alert(

        'Error',

        error?.response?.data?.message ||

        'Face registration failed'
      );
    }
  };

  // =====================================
  // PROGRESS
  // =====================================

  const progress =
    (captures.length /
      TOTAL_CAPTURES) *
    100;

  // =====================================
  // UI
  // =====================================

  return (

    <View style={styles.container}>

      {/* CAMERA */}

      <CameraView

        ref={cameraRef}

        style={styles.camera}

        facing="front"
      />

      {/* OVERLAY */}

      <LinearGradient

        colors={[
          'rgba(0,0,0,0.88)',
          'rgba(0,0,0,0.25)',
          'rgba(0,0,0,0.88)',
        ]}

        style={StyleSheet.absoluteFill}
      />

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

          <View>

            <Text style={styles.headerTitle}>
              AI Face Register
            </Text>

            <Text style={styles.headerSub}>
              Enterprise AI enrollment
            </Text>

          </View>

          <View style={styles.iconButton} />

        </View>

        {/* FACE FRAME */}

        <View style={styles.centerArea}>

          <View style={styles.faceCircle}>

            {/* SCAN */}

            <Animated.View

              style={[

                styles.scanLine,

                {

                  transform: [

                    {

                      translateY:
                        scanAnim.interpolate({

                          inputRange:
                            [0, 1],

                          outputRange:
                            [-120, 120],
                        }),
                    },
                  ],
                },
              ]}
            />

            {/* ICON */}

            <Ionicons
              name="scan-circle"
              size={80}
              color="#00E0FF"
            />

          </View>

        </View>

        {/* BOTTOM PANEL */}

        <ScrollView
          style={styles.bottomPanel}
          showsVerticalScrollIndicator={false}
        >

          {/* PROGRESS */}

          <View style={styles.progressCard}>

            <View style={styles.progressTop}>

              <Text style={styles.progressTitle}>
                Enrollment Progress
              </Text>

              <Text style={styles.progressCount}>
                {captures.length}/{TOTAL_CAPTURES}
              </Text>

            </View>

            <View style={styles.progressBar}>

              <LinearGradient

                colors={
                  COLORS.gradientPrimary
                }

                style={[
                  styles.progressFill,

                  {
                    width:
                      `${progress}%`,
                  },
                ]}
              />

            </View>

          </View>

          {/* GUIDE */}

          <View style={styles.guideCard}>

            <Ionicons
              name="scan"
              size={22}
              color={COLORS.primary}
            />

            <View style={{ flex: 1 }}>

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

          </View>

          {/* AI STATUS */}

          <View style={styles.aiStatusCard}>

            <View style={styles.aiRow}>

              <View
                style={styles.aiDot}
              />

              <Text style={styles.aiTitle}>
                AI Status
              </Text>

            </View>

            <Text style={styles.aiText}>
              {aiStatus}
            </Text>

          </View>

          {/* STATUS */}

          <Text style={styles.statusText}>
            {status}
          </Text>

          {/* CAPTURE BUTTON */}

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
                      size={28}
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
                      size={24}
                      color="#fff"
                    />

                  )
                }

                <Text style={styles.registerText}>

                  {
                    registering

                    ? 'AI Enrollment...'

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

  safeArea: {
    flex: 1,
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
    fontWeight: '800',
    marginTop: SPACING.lg,
  },

  permissionText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },

  permissionButton: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },

  permissionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },

  permissionBtnText: {
    color: '#fff',
    fontSize: FONTS.base,
    fontWeight: '700',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    marginTop: 10,
  },

  headerTitle: {
    color: '#fff',
    fontSize: FONTS.lg,
    fontWeight: '800',
    textAlign: 'center',
  },

  headerSub: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
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

  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  faceCircle: {
    width: 270,
    height: 340,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#00E0FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
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

  bottomPanel: {
    backgroundColor:
      'rgba(10,10,26,0.96)',
    borderTopLeftRadius:
      RADIUS['2xl'],
    borderTopRightRadius:
      RADIUS['2xl'],
    padding: SPACING.xl,
    maxHeight: 380,
  },

  progressCard: {
    marginBottom: SPACING.lg,
  },

  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  progressTitle: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  progressCount: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  progressBar: {
    height: 12,
    backgroundColor:
      'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 20,
  },

  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  guideTitle: {
    color: COLORS.primary,
    fontWeight: '700',
    marginLeft: 12,
  },

  guideText: {
    color: COLORS.textPrimary,
    marginTop: 6,
    marginLeft: 12,
  },

  aiStatusCard: {
    backgroundColor:
      'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },

  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  aiDot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#00D097',
    marginRight: 10,
  },

  aiTitle: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },

  aiText: {
    color: COLORS.textSecondary,
    marginTop: 10,
    lineHeight: 22,
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
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },

  registerGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
  },

  registerText: {
    color: '#fff',
    fontWeight: '800',
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

});