import React from 'react';

import {
  TouchableOpacity,
  Text,
  View,
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

export default function DashboardCard({

  title,

  subtitle,

  icon,

  colors = COLORS.gradientPrimary,

  onPress,

  small = false,

}) {

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.wrapper,

        small && {
          width: '48%',
        },
      ]}
    >

      <LinearGradient
        colors={colors}
        style={[
          styles.card,

          small && {
            minHeight: 170,
          },
        ]}
      >

        {/* ICON */}

        <View style={styles.iconContainer}>

          <Ionicons
            name={icon}
            size={28}
            color="#fff"
          />

        </View>

        {/* CONTENT */}

        <View style={styles.content}>

          <Text style={styles.title}>
            {title}
          </Text>

          {!!subtitle && (

            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}

        </View>

        {/* ARROW */}

        <View style={styles.arrowContainer}>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="rgba(255,255,255,0.9)"
          />

        </View>

      </LinearGradient>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  wrapper: {
    marginBottom: SPACING.md,
  },

  card: {
    borderRadius: RADIUS.xl,

    padding: SPACING.lg,

    minHeight: 150,

    justifyContent: 'space-between',

    ...SHADOWS.primary,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    marginTop: SPACING.lg,
  },

  title: {
    color: '#fff',
    fontSize: FONTS.lg,
    fontWeight: '800',
  },

  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONTS.sm,
    marginTop: 6,
    lineHeight: 20,
  },

  arrowContainer: {
    alignSelf: 'flex-end',
    marginTop: SPACING.md,
  },

});