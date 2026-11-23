/**
 * AttendanceBadge - Status badge for attendance records
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

export default function AttendanceBadge({ status = 'present' }) {
  const config = {
    present: { color: COLORS.success, bg: COLORS.successGlow, icon: 'checkmark-circle', label: 'Present' },
    absent:  { color: COLORS.error,   bg: COLORS.errorGlow,   icon: 'close-circle',     label: 'Absent'  },
    late:    { color: COLORS.warning, bg: 'rgba(255,181,71,0.15)', icon: 'time',         label: 'Late'    },
  }[status] || { color: COLORS.textMuted, bg: COLORS.border, icon: 'help-circle', label: status };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={12} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  label: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
