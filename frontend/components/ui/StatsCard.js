import React from 'react';

import {
  View,
  Text,
 StyleSheet,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../../constants/theme';

export default function StatsCard({

  title,

  value,

  icon,

  colors = COLORS.gradientPrimary,

  percentage,

}) {

  return (

    <LinearGradient
      colors={colors}
      style={styles.card}
    >

      {/* TOP */}

      <View style={styles.topRow}>

        <View style={styles.iconContainer}>

          <Ionicons
            name={icon}
            size={24}
            color="#fff"
          />

        </View>

        {!!percentage && (

          <View style={styles.percentageBadge}>

            <Text style={styles.percentageText}>
              {percentage}
            </Text>

          </View>
        )}

      </View>

      {/* VALUE */}

      <Text style={styles.value}>
        {value}
      </Text>

      {/* TITLE */}

      <Text style={styles.title}>
        {title}
      </Text>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  card: {
    width: '48%',

    borderRadius: RADIUS.xl,

    padding: SPACING.lg,

    minHeight: 150,

    justifyContent: 'space-between',

    marginBottom: SPACING.md,

    ...SHADOWS.primary,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  percentageBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },

  percentageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  value: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    marginTop: SPACING.lg,
  },

  title: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: FONTS.base,
    marginTop: 6,
    fontWeight: '600',
  },

});