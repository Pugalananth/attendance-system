import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {
  LineChart,
} from 'react-native-chart-kit';

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

const screenWidth =
  Dimensions.get('window').width;

export default function AnalyticsChart({

  title = 'Analytics',

  subtitle = 'Monthly performance',

  labels = [],

  data = [],

  suffix = '',

}) {

  return (

    <LinearGradient

      colors={[
        COLORS.bgCard,
        COLORS.bgElevated,
      ]}

      style={styles.container}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.subtitle}>
            {subtitle}
          </Text>

        </View>

      </View>

      {/* CHART */}

      <LineChart

        data={{

          labels,

          datasets: [
            {
              data,
            },
          ],
        }}

        width={
          screenWidth - 60
        }

        height={240}

        yAxisSuffix={suffix}

        withInnerLines={true}

        withOuterLines={false}

        withShadow={true}

        withDots={true}

        withVerticalLabels={true}

        withHorizontalLabels={true}

        bezier

        fromZero

        chartConfig={{

          backgroundGradientFrom:
            COLORS.bgCard,

          backgroundGradientTo:
            COLORS.bgElevated,

          decimalPlaces: 0,

          color: (opacity = 1) =>

            `rgba(79, 142, 247, ${opacity})`,

          labelColor: (opacity = 1) =>

            `rgba(255,255,255,${opacity})`,

          propsForDots: {

            r: '5',

            strokeWidth: '2',

            stroke: '#4F8EF7',
          },

          propsForBackgroundLines: {

            stroke:
              'rgba(255,255,255,0.06)',
          },

          fillShadowGradient:
            '#4F8EF7',

          fillShadowGradientOpacity:
            0.25,
        }}

        style={styles.chart}
      />

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {

    marginHorizontal: SPACING.base,

    marginBottom: SPACING.lg,

    borderRadius: RADIUS['2xl'],

    paddingVertical: SPACING.lg,

    overflow: 'hidden',

    borderWidth: 1,

    borderColor: COLORS.border,

    ...SHADOWS.md,
  },

  header: {

    paddingHorizontal: SPACING.lg,

    marginBottom: SPACING.base,
  },

  title: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',
  },

  subtitle: {

    color: COLORS.textSecondary,

    marginTop: 6,

    fontSize: FONTS.sm,
  },

  chart: {

    borderRadius: RADIUS.xl,

    marginLeft: -12,
  },

});