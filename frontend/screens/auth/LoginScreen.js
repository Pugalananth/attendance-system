import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import AsyncStorage from
'@react-native-async-storage/async-storage';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import GradientButton from
'../../components/GradientButton';

import InputField from
'../../components/InputField';

import {
  authAPI,
} from '../../services/api';

import {
  COLORS,
} from '../../constants/theme';

export default function LoginScreen({
  navigation,
}) {

  // =====================================================
  // STATES
  // =====================================================

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // ANIMATION
  // =====================================================

  const logoAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const formAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {

    Animated.sequence([

      Animated.timing(
        logoAnim,
        {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        formAnim,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ),

    ]).start();

  }, []);

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {

    let newErrors = {};

    if (!email.trim()) {

      newErrors.email =
        'Email is required';
    }

    if (!password.trim()) {

      newErrors.password =
        'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(
      newErrors
    ).length === 0;
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin =
    async () => {

    try {

      if (!validate()) {
        return;
      }

      setLoading(true);

      console.log(
        'LOGIN REQUEST:',
        email
      );

      // ===============================================
      // API LOGIN
      // ===============================================

      const response =
        await authAPI.login(

          email
            .trim()
            .toLowerCase(),

          password

        );

      const result =
        response.data;

      console.log(
        'LOGIN RESPONSE:',
        result
      );

      setLoading(false);

      // ===============================================
      // FAILED
      // ===============================================

      if (!result.success) {

        Alert.alert(

          'Login Failed',

          result.message ||

          'Invalid credentials'

        );

        return;
      }

      // ===============================================
      // USER DATA
      // ===============================================

      const user =
        result?.data?.user;

      const accessToken =
        result?.data?.access_token;

      const refreshToken =
        result?.data?.refresh_token;

      // ===============================================
      // SAVE STORAGE
      // ===============================================

      await AsyncStorage.setItem(

        'access_token',

        accessToken

      );

      await AsyncStorage.setItem(

        'refresh_token',

        refreshToken

      );

      await AsyncStorage.setItem(

        'user_data',

        JSON.stringify(user)

      );

      // ===============================================
      // SUCCESS
      // ===============================================

      Alert.alert(

        'Login Success',

        `Welcome ${user.name}`

      );

      // ===============================================
      // ROLE NAVIGATION
      // ===============================================

      if (
        user.role === 'admin'
      ) {

        navigation.replace(
          'AdminDashboard'
        );
      }

      else if (
        user.role === 'hr'
      ) {

        navigation.replace(
          'HRDashboard'
        );
      }

      else if (
        user.role ===
        'teamleader'
      ) {

        navigation.replace(
          'TeamLeaderDashboard'
        );
      }

      else if (
        user.role ===
        'employee'
      ) {

        navigation.replace(
          'EmployeeDashboard'
        );
      }

      else {

        navigation.replace(
          'Dashboard'
        );
      }

    } catch (error) {

      console.log(
        'LOGIN ERROR:',
        error?.response?.data ||
        error.message
      );

      setLoading(false);

      Alert.alert(

        'Server Error',

        error?.response?.data
          ?.message ||

        error.message ||

        'Connection failed'

      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <View style={styles.container}>

      <LinearGradient

        colors={[
          '#050816',
          '#090B1F',
          '#050816',
        ]}

        style={
          StyleSheet.absoluteFill
        }

      />

      <KeyboardAvoidingView

        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }

        style={{ flex: 1 }}

      >

        <ScrollView

          contentContainerStyle={
            styles.scroll
          }

          showsVerticalScrollIndicator={
            false
          }

        >

          <SafeAreaView>

            {/* LOGO */}

            <Animated.View

              style={[

                styles.logoSection,

                {

                  opacity:
                    logoAnim,

                  transform: [

                    {

                      translateY:

                        logoAnim.interpolate({

                          inputRange:
                            [0, 1],

                          outputRange:
                            [-30, 0],

                        }),

                    },

                  ],

                },

              ]}

            >

              <LinearGradient

                colors={
                  COLORS.gradientPrimary
                }

                style={
                  styles.logoBox
                }

              >

                <Ionicons
                  name="scan"
                  size={38}
                  color="#fff"
                />

              </LinearGradient>

              <Text style={styles.title}>
                FaceAttend AI
              </Text>

              <Text style={styles.subtitle}>
                Smart Employee Attendance System
              </Text>

            </Animated.View>

            {/* FORM */}

            <Animated.View

              style={[

                styles.formCard,

                {

                  opacity:
                    formAnim,

                  transform: [

                    {

                      translateY:

                        formAnim.interpolate({

                          inputRange:
                            [0, 1],

                          outputRange:
                            [30, 0],

                        }),

                    },

                  ],

                },

              ]}

            >

              <Text style={styles.formTitle}>
                Login
              </Text>

              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                icon="lock-closed-outline"
                secureTextEntry
                error={errors.password}
              />

              <GradientButton
                title="Login"
                onPress={handleLogin}
                loading={loading}
                size="lg"
                style={{
                  marginTop: 15,
                }}
              />

            </Animated.View>

          </SafeAreaView>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050816',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#9CA3AF',
    marginTop: 5,
    fontSize: 15,
  },

  formCard: {
    backgroundColor: '#11162A',
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: '#1F2937',
  },

  formTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

});