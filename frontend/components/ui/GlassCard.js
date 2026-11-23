import React from 'react';

import {
  View,
  StyleSheet,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  COLORS,
  RADIUS,
  SHADOWS,
} from '../../constants/theme';

export default function GlassCard({

  children,

  style,

  gradient = false,

}) {

  // =========================================
  // GRADIENT CARD
  // =========================================

  if (gradient) {

    return (

      <LinearGradient
        colors={COLORS.gradientCard}
        style={[
          styles.card,
          style,
        ]}
      >

        {children}

      </LinearGradient>
    );
  }

  // =========================================
  // NORMAL GLASS CARD
  // =========================================

  return (

    <View
      style={[
        styles.card,
        style,
      ]}
    >

      {children}

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: COLORS.bgCard,

    borderRadius: RADIUS.xl,

    padding: 18,

    borderWidth: 1,

    borderColor: COLORS.border,

    marginBottom: 16,

    overflow: 'hidden',

    ...SHADOWS.md,
  },

});