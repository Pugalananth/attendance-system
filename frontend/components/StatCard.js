/**
 * StatCard - Dashboard statistics card with gradient accent
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

export default function StatCard({ title, value, subtitle, icon, gradient, trend }) {
  return (
    <View style={[styles.card, SHADOWS.md]}>
      <LinearGradient
        colors={gradient || COLORS.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconWrap}
      >
        <Ionicons name={icon} size={20} color="#fff" />
      </LinearGradient>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>

      {subtitle && (
        <View style={styles.subtitleRow}>
          {trend !== undefined && (
            <Ionicons
              name={trend >= 0 ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend >= 0 ? COLORS.success : COLORS.error}
            />
          )}
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    minWidth: 140,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: FONTS['2xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONTS.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: 3,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.xs,
    fontWeight: '400',
  },
});
