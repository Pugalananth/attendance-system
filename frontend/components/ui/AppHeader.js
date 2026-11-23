import React from 'react';

import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  COLORS,
  SPACING,
} from '../../constants/theme';

export default function ScreenContainer({

  children,

  scroll = true,

  style,

  contentContainerStyle,

}) {

  const Content = scroll
    ? ScrollView
    : View;

  return (

    <SafeAreaView style={styles.safe}>

      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bg}
      />

      <LinearGradient
        colors={COLORS.gradientDark}
        style={styles.background}
      />

      <Content

        style={[
          styles.container,
          style,
        ]}

        contentContainerStyle={[
          styles.content,
          contentContainerStyle,
        ]}

        showsVerticalScrollIndicator={false}
      >

        {children}

      </Content>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 40,
  },

});