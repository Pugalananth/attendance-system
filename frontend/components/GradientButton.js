/**
 * ENTERPRISE GRADIENT BUTTON
 * Premium reusable button component
 */

import React, { useRef } from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../constants/theme';

export default function GradientButton({

  title,
  onPress,
  loading = false,
  disabled = false,

  variant = 'primary',
  // primary | success | danger | outline | ghost

  size = 'md',
  // sm | md | lg

  icon = null,

  style = {},
  textStyle = {},

  fullWidth = true,

}) {

  const scaleAnim =
    useRef(new Animated.Value(1)).current;

  // =====================================
  // BUTTON PRESS ANIMATION
  // =====================================

  const handlePressIn = () => {

    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  // =====================================
  // GRADIENTS
  // =====================================

  const getGradient = () => {

    switch (variant) {

      case 'success':
        return COLORS.gradientSuccess;

      case 'danger':
        return COLORS.gradientDanger;

      default:
        return COLORS.gradientPrimary;
    }
  };

  // =====================================
  // BUTTON SIZE
  // =====================================

  const getSizeStyles = () => {

    switch (size) {

      case 'sm':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: RADIUS.md,
        };

      case 'lg':
        return {
          paddingVertical: 20,
          paddingHorizontal: 28,
          borderRadius: RADIUS.xl,
        };

      default:
        return {
          paddingVertical: 16,
          paddingHorizontal: 22,
          borderRadius: RADIUS.lg,
        };
    }
  };

  // =====================================
  // TEXT SIZE
  // =====================================

  const getTextSize = () => {

    switch (size) {

      case 'sm':
        return FONTS.sm;

      case 'lg':
        return FONTS.lg;

      default:
        return FONTS.base;
    }
  };

  const sizeStyles = getSizeStyles();

  const isDisabled =
    disabled || loading;

  // =====================================
  // OUTLINE BUTTON
  // =====================================

  if (variant === 'outline') {

    return (

      <Animated.View
        style={[
          {
            transform: [
              { scale: scaleAnim }
            ]
          },
          style,
        ]}
      >

        <TouchableOpacity

          activeOpacity={0.9}

          onPress={
            isDisabled
              ? null
              : onPress
          }

          onPressIn={handlePressIn}

          onPressOut={handlePressOut}

          style={[
            styles.outlineButton,
            sizeStyles,

            fullWidth && {
              width: '100%',
            },

            isDisabled &&
            styles.disabled,
          ]}
        >

          {
            loading
              ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                />
              )
              : (
                <View style={styles.row}>

                  {
                    icon &&
                    <View style={styles.iconWrap}>
                      {icon}
                    </View>
                  }

                  <Text
                    style={[
                      styles.outlineText,
                      {
                        fontSize: getTextSize(),
                      },
                      textStyle,
                    ]}
                  >
                    {title}
                  </Text>

                </View>
              )
          }

        </TouchableOpacity>

      </Animated.View>
    );
  }

  // =====================================
  // GHOST BUTTON
  // =====================================

  if (variant === 'ghost') {

    return (

      <Animated.View
        style={[
          {
            transform: [
              { scale: scaleAnim }
            ]
          },
          style,
        ]}
      >

        <TouchableOpacity

          activeOpacity={0.8}

          onPress={
            isDisabled
              ? null
              : onPress
          }

          onPressIn={handlePressIn}

          onPressOut={handlePressOut}

          style={[
            styles.ghostButton,
            sizeStyles,
          ]}
        >

          <View style={styles.row}>

            {
              icon &&
              <View style={styles.iconWrap}>
                {icon}
              </View>
            }

            <Text
              style={[
                styles.ghostText,
                {
                  fontSize: getTextSize(),
                },
                textStyle,
              ]}
            >
              {title}
            </Text>

          </View>

        </TouchableOpacity>

      </Animated.View>
    );
  }

  // =====================================
  // MAIN BUTTON
  // =====================================

  return (

    <Animated.View

      style={[

        {
          transform: [
            { scale: scaleAnim }
          ]
        },

        fullWidth && {
          width: '100%',
        },

        SHADOWS.primaryGlow,

        style,
      ]}
    >

      <TouchableOpacity

        activeOpacity={0.9}

        disabled={isDisabled}

        onPress={
          isDisabled
            ? null
            : onPress
        }

        onPressIn={handlePressIn}

        onPressOut={handlePressOut}
      >

        <LinearGradient

          colors={
            isDisabled
              ? ['#313852', '#262D44']
              : getGradient()
          }

          start={{
            x: 0,
            y: 0,
          }}

          end={{
            x: 1,
            y: 1,
          }}

          style={[
            styles.gradientButton,
            sizeStyles,
          ]}
        >

          {
            loading
              ? (
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />
              )
              : (
                <View style={styles.row}>

                  {
                    icon &&
                    <View style={styles.iconWrap}>
                      {icon}
                    </View>
                  }

                  <Text
                    style={[
                      styles.buttonText,
                      {
                        fontSize: getTextSize(),
                      },
                      textStyle,
                    ]}
                  >
                    {title}
                  </Text>

                </View>
              )
          }

        </LinearGradient>

      </TouchableOpacity>

    </Animated.View>
  );
}

const styles = StyleSheet.create({

  gradientButton: {

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: RADIUS.lg,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.08)',
  },

  buttonText: {

    color: '#FFFFFF',

    fontWeight: '700',

    letterSpacing: 0.4,
  },

  outlineButton: {

    borderWidth: 1.5,

    borderColor: COLORS.borderActive,

    backgroundColor: COLORS.bgGlass,

    alignItems: 'center',

    justifyContent: 'center',
  },

  outlineText: {

    color: COLORS.primary,

    fontWeight: '700',
  },

  ghostButton: {

    alignItems: 'center',

    justifyContent: 'center',
  },

  ghostText: {

    color: COLORS.textSecondary,

    fontWeight: '600',
  },

  disabled: {

    opacity: 0.5,
  },

  row: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  iconWrap: {

    marginRight: SPACING.sm,
  },
});