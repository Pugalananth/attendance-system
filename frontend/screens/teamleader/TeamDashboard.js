import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {

  COLORS,
  FONTS,
  SHADOWS,

} from '../../constants/theme';

// import api from '../../services/api';

export default function TeamDashboard({
  navigation,
}) {

  // =====================================
  // STATES
  // =====================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [dashboard,
    setDashboard] =
      useState({

        members: 0,

        present: 0,

        absent: 0,

        productivity: 0,

        completedTasks: 0,

        pendingTasks: 0,

        averageHours: '',

        aiAccuracy: '',

        activities: [],
      });

  // =====================================
  // LOAD DASHBOARD
  // =====================================

  const loadDashboard =
    async () => {

    try {

      setLoading(true);

      // ===============================
      // BACKEND API
      // ===============================

      /*
      const response =
        await api.get(
          '/team/dashboard'
        );

      setDashboard(
        response.data
      );
      */

      // ===============================
      // MOCK DATA
      // ===============================

      setTimeout(() => {

        setDashboard({

          members: 24,

          present: 22,

          absent: 2,

          productivity: 94,

          completedTasks: 42,

          pendingTasks: 6,

          averageHours:
            '08h 31m',

          aiAccuracy:
            '99.2%',

          activities: [

            {
              icon:
                'checkmark-circle',
              text:
                'Arun Kumar completed Mobile UI module',
            },

            {
              icon:
                'analytics',
              text:
                'Attendance increased by 7%',
            },

            {
              icon:
                'scan',
              text:
                'AI face verification active',
            },

            {
              icon:
                'time',
              text:
                '2 employees marked late today',
            },

          ],
        });

        setLoading(false);

      }, 1200);

    } catch (error) {

      console.log(error);

      setLoading(false);

      Alert.alert(
        'Error',
        'Failed to load dashboard'
      );
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadDashboard();

  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      {/* BACKGROUND */}

      <LinearGradient

        colors={[
          '#050816',
          '#0A0A1A',
          '#101528',
        ]}

        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>

        <ScrollView

          showsVerticalScrollIndicator={
            false
          }

          refreshControl={

            <RefreshControl

              refreshing={
                refreshing
              }

              onRefresh={
                onRefresh
              }

              tintColor={
                COLORS.primary
              }
            />
          }

          contentContainerStyle={
            styles.scroll
          }
        >

          {/* HEADER */}

          <View style={styles.header}>

            <View>

              <Text style={styles.smallText}>
                Enterprise Team Operations
              </Text>

              <Text style={styles.title}>
                Team Dashboard
              </Text>

              <Text style={styles.subtitle}>
                Productivity & attendance overview
              </Text>

            </View>

            <LinearGradient

              colors={
                COLORS.gradientPrimary
              }

              style={styles.headerIcon}
            >

              <Ionicons
                name="grid"
                size={28}
                color="#FFFFFF"
              />

            </LinearGradient>

          </View>

          {/* HERO */}

          <LinearGradient

            colors={
              COLORS.gradientPrimary
            }

            style={styles.heroCard}
          >

            <View style={styles.heroTop}>

              <View>

                <Text style={styles.heroTitle}>
                  Team Operations
                </Text>

                <Text style={styles.heroSub}>
                  Enterprise productivity insights
                </Text>

              </View>

              <Ionicons
                name="people"
                size={50}
                color="#FFFFFF"
              />

            </View>

            <View style={styles.heroStats}>

              <HeroStat
                value={dashboard.members}
                label="Members"
              />

              <HeroStat
                value={`${dashboard.productivity}%`}
                label="Efficiency"
              />

              <HeroStat
                value={dashboard.aiAccuracy}
                label="AI Accuracy"
              />

            </View>

          </LinearGradient>

          {/* ANALYTICS */}

          <Text style={styles.sectionTitle}>
            Attendance Analytics
          </Text>

          <View style={styles.analyticsRow}>

            <AnalyticsCard
              title="Present"
              value={dashboard.present}
              icon="checkmark-circle"
              color="#00D097"
            />

            <AnalyticsCard
              title="Absent"
              value={dashboard.absent}
              icon="close-circle"
              color="#FF4F6D"
            />

          </View>

          <View style={styles.analyticsRow}>

            <AnalyticsCard
              title="Tasks Done"
              value={
                dashboard.completedTasks
              }
              icon="checkmark-done"
              color="#4F8EF7"
            />

            <AnalyticsCard
              title="Pending"
              value={
                dashboard.pendingTasks
              }
              icon="time"
              color="#FFB547"
            />

          </View>

          {/* SUMMARY */}

          <View style={styles.summaryRow}>

            <SummaryCard
              title="Average Hours"
              value={
                dashboard.averageHours
              }
              icon="timer"
            />

            <SummaryCard
              title="AI Verification"
              value={
                dashboard.aiAccuracy
              }
              icon="scan-circle"
            />

          </View>

          {/* ACTIVITIES */}

          <Text style={styles.sectionTitle}>
            Live Activities
          </Text>

          <View style={styles.activityContainer}>

            {

              dashboard.activities.map(
                (item, index) => (

                <ActivityRow
                  key={index}
                  icon={item.icon}
                  text={item.text}
                />
              ))
            }

          </View>

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================
// HERO STAT
// =====================================

function HeroStat({
  value,
  label,
}) {

  return (

    <View style={styles.heroStat}>

      <Text style={styles.heroValue}>
        {value}
      </Text>

      <Text style={styles.heroLabel}>
        {label}
      </Text>

    </View>
  );
}

// =====================================
// ANALYTICS CARD
// =====================================

function AnalyticsCard({

  title,
  value,
  icon,
  color,

}) {

  return (

    <View style={styles.analyticsCard}>

      <View
        style={[
          styles.analyticsIcon,
          {
            backgroundColor:
              `${color}22`,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={24}
          color={color}
        />

      </View>

      <Text style={styles.analyticsValue}>
        {value}
      </Text>

      <Text style={styles.analyticsTitle}>
        {title}
      </Text>

    </View>
  );
}

// =====================================
// SUMMARY CARD
// =====================================

function SummaryCard({

  title,
  value,
  icon,

}) {

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.summaryCard}
    >

      <Ionicons
        name={icon}
        size={28}
        color="#4F8EF7"
      />

      <Text style={styles.summaryValue}>
        {value}
      </Text>

      <Text style={styles.summaryTitle}>
        {title}
      </Text>

    </TouchableOpacity>
  );
}

// =====================================
// ACTIVITY ROW
// =====================================

function ActivityRow({

  icon,
  text,

}) {

  return (

    <View style={styles.activityRow}>

      <Ionicons
        name={icon}
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.activityText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050816',
  },

  loader: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor:
      '#050816',
  },

  loadingText: {

    color: '#FFFFFF',

    marginTop: 14,

    fontSize: 16,
  },

  scroll: {
    padding: 20,
    paddingBottom: 100,
  },

  header: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 30,
  },

  smallText: {

    color: COLORS.textSecondary,

    fontSize: 14,
  },

  title: {

    color: '#FFFFFF',

    fontSize: 34,

    fontWeight: '800',
  },

  subtitle: {

    color: COLORS.textMuted,

    marginTop: 6,
  },

  headerIcon: {

    width: 62,

    height: 62,

    borderRadius: 22,

    justifyContent: 'center',

    alignItems: 'center',

    ...SHADOWS.primary,
  },

  heroCard: {

    borderRadius: 28,

    padding: 24,

    marginBottom: 30,

    ...SHADOWS.primary,
  },

  heroTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 30,
  },

  heroTitle: {

    color: '#FFFFFF',

    fontSize: 24,

    fontWeight: '800',
  },

  heroSub: {

    color:
      'rgba(255,255,255,0.85)',

    marginTop: 6,
  },

  heroStats: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  heroStat: {

    alignItems: 'center',
  },

  heroValue: {

    color: '#FFFFFF',

    fontSize: 28,

    fontWeight: '800',
  },

  heroLabel: {

    color:
      'rgba(255,255,255,0.82)',

    marginTop: 6,
  },

  sectionTitle: {

    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '800',

    marginBottom: 18,

    marginTop: 10,
  },

  analyticsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 16,
  },

  analyticsCard: {

    width: '48%',

    backgroundColor:
      '#151D35',

    borderRadius: 22,

    padding: 20,
  },

  analyticsIcon: {

    width: 52,

    height: 52,

    borderRadius: 18,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  analyticsValue: {

    color: '#FFFFFF',

    fontSize: 28,

    fontWeight: '800',
  },

  analyticsTitle: {

    color: COLORS.textSecondary,

    marginTop: 6,
  },

  summaryRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 10,

    marginBottom: 30,
  },

  summaryCard: {

    width: '48%',

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    alignItems: 'center',
  },

  summaryValue: {

    color: '#FFFFFF',

    fontSize: 24,

    fontWeight: '800',

    marginTop: 14,
  },

  summaryTitle: {

    color: COLORS.textSecondary,

    marginTop: 8,
  },

  activityContainer: {

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    marginBottom: 40,
  },

  activityRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 20,
  },

  activityText: {

    color: '#FFFFFF',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

});