/**
 * LoadingScreen - Full-screen loading indicator
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function LoadingScreen({ message = 'Loading...' }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Rotation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A1A', '#12122A', '#0A0A1A']}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View style={[styles.logoWrap, { transform: [{ scale: pulse }] }]}>
        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.logoGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
            <View style={styles.spinnerInner} />
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.appName}>FaceAttend</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <DotPulse key={i} delay={i * 200} />
        ))}
      </View>
    </View>
  );
}

function DotPulse({ delay }) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.dot, { opacity: anim }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  logoWrap: {
    marginBottom: SPACING.xl,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
  },
  spinnerInner: {
    flex: 1,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: FONTS['2xl'],
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: FONTS.base,
    fontWeight: '400',
    marginBottom: SPACING.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
});
