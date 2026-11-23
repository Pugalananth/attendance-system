/**
 * GlassCard - Glassmorphism card with blur effect
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../constants/theme';

export default function GlassCard({
  children,
  style = {},
  intensity = 20,
  padding = SPACING.base,
  borderColor = COLORS.border,
  noShadow = false,
}) {
  return (
    <View
      style={[
        styles.container,
        !noShadow && SHADOWS.md,
        { borderColor },
        style,
      ]}
    >
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.bgCard,
  },
  content: {
    flex: 1,
  },
});
