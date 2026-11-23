
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  authAPI,
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // LOAD SAVED USER
  // =====================================

  useEffect(() => {

    const loadUser = async () => {

      try {

        const savedUser =
          await AsyncStorage.getItem(
            'user_data'
          );

        if (savedUser) {

          setUser(
            JSON.parse(savedUser)
          );
        }

      } catch (error) {

        console.log(
          'LOAD USER ERROR:',
          error
        );

      } finally {

        setLoading(false);
      }
    };

    loadUser();

  }, []);

  // =====================================
  // LOGIN
  // =====================================


  
  const login = async (
    email,
    password
  ) => {

    try {

      const response =
        await authAPI.login(
          email,
          password
        );

      const data =
        response.data;

      console.log(
        'LOGIN RESPONSE:',
        JSON.stringify(data, null, 2)
      );

      console.log(
        'LOGIN RESPONSE:',
        JSON.stringify(data)
      );

      if (data?.success) {

        const employee =

          data?.data?.user ||

          data?.user ||

          data?.employee ||

          null;

        const accessToken =

          data?.data?.access_token ||

          data?.access_token ||

          null;

        const refreshToken =

          data?.data?.refresh_token ||

          data?.refresh_token ||

          null;
        console.log('EMPLOYEE:', employee);
        console.log('ACCESS TOKEN:', accessToken);
        console.log('REFRESH TOKEN:', refreshToken);

        if (employee) {

          setUser(employee);

          await AsyncStorage.setItem(
            'user_data',
            JSON.stringify(employee)
          );
        }

        if (accessToken) {

          await AsyncStorage.setItem(
            'access_token',
            accessToken
          );

          console.log(
            'ACCESS TOKEN SAVED'
          );
        }

        if (refreshToken) {

          await AsyncStorage.setItem(
            'refresh_token',
            refreshToken
          );
        }

        return {
          success: true,
          user: employee,
        };
      }

      return {
        success: false,
        message:
          data?.message ||
          'Login failed',
      };

    } catch (error) {

      console.log(
        'LOGIN ERROR:',
        error?.response?.data ||
        error.message
      );

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'Server connection failed',
      };
    }
  };

  

  // =====================================
  // REGISTER
  // =====================================

  const register = async (
    userData
  ) => {

    try {

      const response =
        await authAPI.register(
          userData
        );

      return response.data;

    } catch (error) {

      console.log(
        'REGISTER ERROR:',
        error
      );

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'Registration failed',
      };
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const logout = async () => {

    try {

      setUser(null);

      await AsyncStorage.removeItem(
        'user_data'
      );

      await AsyncStorage.removeItem(
        'access_token'
      );

      await AsyncStorage.removeItem(
        'refresh_token'
      );

    } catch (error) {

      console.log(
        'LOGOUT ERROR:',
        error
      );
    }
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  return useContext(
    AuthContext
  );
};

