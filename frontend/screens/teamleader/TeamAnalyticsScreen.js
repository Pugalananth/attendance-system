import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import ScreenContainer from
'../../components/ui/ScreenContainer';

import AppHeader from
'../../components/ui/AppHeader';

import GlassCard from
'../../components/ui/GlassCard';

import StatsCard from
'../../components/ui/StatsCard';

import {

  COLORS,
  FONTS,

} from '../../constants/theme';

// import api from '../../services/api';

export default function TeamAnalyticsScreen({
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

  const [analytics,
    setAnalytics] =
      useState({

        teamMembers: 0,

        attendance: 0,

        lateEntries: 0,

        wfhUsers: 0,

        productivity: 0,

        completion: 0,

        efficiency: 0,

        attendanceGrowth: 0,

        members: [],

        aiInsights: [],

        summary: {},
      });

  // =====================================
  // LOAD ANALYTICS
  // =====================================

  const loadAnalytics =
    async () => {

    try {

      setLoading(true);

      // ===============================
      // BACKEND API
      // ===============================

      /*
      const response =
        await api.get(
          '/team/analytics'
        );

      setAnalytics(
        response.data
      );
      */

      // ===============================
      // MOCK DATA
      // ===============================

      setTimeout(() => {

        setAnalytics({

          teamMembers: 18,

          attendance: 95,

          lateEntries: 3,

          wfhUsers: 5,

          productivity: 92,

          completion: 89,

          efficiency: 94,

          attendanceGrowth: 11,

          members: [

            {
              name:
                'Arun Kumar',
              status:
                'Present',
            },

            {
              name:
                'Sophia',
              status: 'WFH',
            },

            {
              name:
                'David',
              status: 'Late',
            },

            {
              name:
                'Rahul',
              status:
                'Present',
            },

          ],

          aiInsights: [

            '100% successful face verification',

            'No spoofing attempts detected',

            'Attendance improved by 9%',

            'AI liveness detection active',

          ],

          summary: {

            present: 16,

            absent: 1,

            wfh: 1,

            hours:
              '08h 24m',
          },
        });

        setLoading(false);

      }, 1200);

    } catch (error) {

      console.log(error);

      setLoading(false);

      Alert.alert(
        'Error',
        'Failed to load analytics'
      );
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadAnalytics();

    setRefreshing(false);
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadAnalytics();

  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <ScreenContainer>

        <View style={styles.loader}>

          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.loadingText}>
            Loading analytics...
          </Text>

        </View>

      </ScreenContainer>
    );
  }

  return (

    <ScreenContainer>

      {/* HEADER */}

      <AppHeader
        title="Team Analytics"
        subtitle="Enterprise performance insights"
        navigation={navigation}
        showBack
      />

      <ScrollView

        showsVerticalScrollIndicator={
          false
        }

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={onRefresh}

            tintColor={
              COLORS.primary
            }
          />
        }
      >

        {/* STATS */}

        <View style={styles.statsRow}>

          <StatsCard
            title="Members"
            value={
              analytics.teamMembers
            }
            icon="people"
            colors={COLORS.gradientPrimary}
          />

          <StatsCard
            title="Attendance"
            value={`${analytics.attendance}%`}
            icon="checkmark-circle"
            colors={COLORS.gradientSuccess}
          />

        </View>

        <View style={styles.statsRow}>

          <StatsCard
            title="Late"
            value={
              analytics.lateEntries
            }
            icon="time"
            colors={COLORS.gradientDanger}
          />

          <StatsCard
            title="WFH"
            value={
              analytics.wfhUsers
            }
            icon="home"
            colors={COLORS.gradientSky}
          />

        </View>

        {/* PERFORMANCE */}

        <GlassCard gradient>

          <Text style={styles.sectionTitle}>
            Team Performance
          </Text>

          <PerformanceRow
            label="Daily Productivity"
            value={`${analytics.productivity}%`}
          />

          <PerformanceRow
            label="Task Completion"
            value={`${analytics.completion}%`}
          />

          <PerformanceRow
            label="Attendance Growth"
            value={`+${analytics.attendanceGrowth}%`}
          />

          <PerformanceRow
            label="Team Efficiency"
            value={`${analytics.efficiency}%`}
          />

        </GlassCard>

        {/* MEMBERS */}

        <GlassCard>

          <Text style={styles.darkTitle}>
            Team Member Status
          </Text>

          {

            analytics.members.map(
              (item, index) => (

              <MemberRow
                key={index}
                name={item.name}
                status={item.status}
              />
            ))
          }

        </GlassCard>

        {/* AI INSIGHTS */}

        <GlassCard gradient>

          <Text style={styles.sectionTitle}>
            AI Insights
          </Text>

          {

            analytics.aiInsights.map(
              (item, index) => (

              <InsightRow
                key={index}
                text={item}
              />
            ))
          }

        </GlassCard>

        {/* SUMMARY */}

        <GlassCard>

          <Text style={styles.darkTitle}>
            Daily Summary
          </Text>

          <SummaryRow
            label="Present Employees"
            value={
              analytics.summary.present
            }
          />

          <SummaryRow
            label="Absent Employees"
            value={
              analytics.summary.absent
            }
          />

          <SummaryRow
            label="Work From Home"
            value={
              analytics.summary.wfh
            }
          />

          <SummaryRow
            label="Average Hours"
            value={
              analytics.summary.hours
            }
          />

        </GlassCard>

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// PERFORMANCE ROW
// =====================================

function PerformanceRow({

  label,
  value,

}) {

  return (

    <View style={styles.row}>

      <Text style={styles.whiteText}>
        {label}
      </Text>

      <Text style={styles.greenText}>
        {value}
      </Text>

    </View>
  );
}

// =====================================
// MEMBER ROW
// =====================================

function MemberRow({

  name,
  status,

}) {

  const statusColor =

    status === 'Present'

      ? COLORS.success

      : status === 'WFH'

      ? COLORS.warning

      : COLORS.error;

  return (

    <View style={styles.memberRow}>

      <View style={styles.memberLeft}>

        <View style={styles.avatar}>

          <Ionicons
            name="person"
            size={18}
            color="#fff"
          />

        </View>

        <Text style={styles.memberName}>
          {name}
        </Text>

      </View>

      <View
        style={[
          styles.badge,
          {
            backgroundColor:
              statusColor,
          },
        ]}
      >

        <Text style={styles.badgeText}>
          {status}
        </Text>

      </View>

    </View>
  );
}

// =====================================
// INSIGHT ROW
// =====================================

function InsightRow({
  text,
}) {

  return (

    <View style={styles.insightRow}>

      <Ionicons
        name="analytics"
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.insightText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// SUMMARY ROW
// =====================================

function SummaryRow({

  label,
  value,

}) {

  return (

    <View style={styles.row}>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>

      <Text style={styles.summaryValue}>
        {value}
      </Text>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  loader: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  loadingText: {

    color: COLORS.textPrimary,

    marginTop: 14,

    fontSize: 16,
  },

  statsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  sectionTitle: {

    color: '#fff',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  darkTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  row: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 18,
  },

  whiteText: {

    color: '#fff',

    fontSize: FONTS.base,
  },

  greenText: {

    color: '#00FFB2',

    fontWeight: '800',

    fontSize: FONTS.base,
  },

  memberRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  memberLeft: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  avatar: {

    width: 42,

    height: 42,

    borderRadius: 14,

    backgroundColor:
      COLORS.primary,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 12,
  },

  memberName: {

    color: COLORS.textPrimary,

    fontWeight: '700',

    fontSize: FONTS.base,
  },

  badge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 18,
  },

  badgeText: {

    color: '#fff',

    fontWeight: '700',

    fontSize: 12,
  },

  insightRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  insightText: {

    color: '#fff',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

  summaryLabel: {

    color: COLORS.textSecondary,

    fontSize: FONTS.base,
  },

  summaryValue: {

    color: COLORS.textPrimary,

    fontWeight: '800',

    fontSize: FONTS.base,
  },

});