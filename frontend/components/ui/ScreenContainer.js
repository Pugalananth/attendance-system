import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

export default function ScreenContainer({
  children,
}) {

  return (

    <SafeAreaView
      style={styles.safe}
    >

      <LinearGradient

        colors={[
          '#050816',
          '#0A0A1A',
          '#101528',
        ]}

        style={styles.container}
      >

        <View style={styles.content}>
          {children}
        </View>

      </LinearGradient>

    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor: '#050816',
    },

    container: {
      flex: 1,
    },

    content: {
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 12,
    },
  });