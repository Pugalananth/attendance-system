import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../../constants/theme';

export default function PrimaryButton({

  title,

  onPress,

  loading = false,

  disabled = false,

  colors = COLORS.gradientPrimary,

  style,

  textStyle,

}) {

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
    >

      <LinearGradient
        colors={
          disabled
            ? ['#555', '#444']
            : colors
        }
        style={styles.button}
      >

        {loading ? (

          <ActivityIndicator
            color="#fff"
          />

        ) : (

          <Text
            style={[
              styles.text,
              textStyle,
            ]}
          >
            {title}
          </Text>

        )}

      </LinearGradient>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button: {
    height: 58,

    borderRadius: RADIUS.xl,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: SPACING.xl,

    ...SHADOWS.primary,
  },

  text: {
    color: '#fff',

    fontSize: FONTS.base,

    fontWeight: '800',

    letterSpacing: 0.5,
  },

});