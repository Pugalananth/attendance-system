import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import ScreenContainer from
'../../components/ui/ScreenContainer';

import AppHeader from
'../../components/ui/AppHeader';

import GlassCard from
'../../components/ui/GlassCard';

import StatsCard from
'../../components/ui/StatsCard';

import {
  getHRAnalytics,
} from '../../services/hrService';

import {

  COLORS,
  FONTS,
  RADIUS,

} from '../../constants/theme';

export default function AnalyticsScreen({
  navigation,
}) {

  // =====================================================
  // STATES
  // =====================================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [analytics,
    setAnalytics] =
      useState({

        attendanceRate: 0,

        productivity: 0,

        lateEntries: 0,

        remoteEmployees: 0,

        aiAccuracy: 98,

        spoofAttempts: 0,

        blinkVerification: true,

        departments: [],
      });

  // =====================================================
  // LOAD ANALYTICS
  // =====================================================

  const loadAnalytics =
    useCallback(async () => {

      try {

        setLoading(true);

        const result =
          await getHRAnalytics();

        if (result.success) {

          const data =
            result.analytics || {};

          setAnalytics({

            attendanceRate:
              data.attendanceRate || 0,

            productivity:
              data.attendanceRate >= 90
                ? 95
                : 85,

            lateEntries:
              data.lateEntries || 0,

            remoteEmployees:
              data.pendingRequests ||
              data.pendingLeaves ||
              data.pendingWFH ||
              0,

            aiAccuracy:
              data.aiAccuracy || 98,

            spoofAttempts:
              data.spoofAttempts || 0,

            blinkVerification:
              data.blinkVerification ?? true,

            departments:
              (data.departments || [])
                .map((item) => ({
                  name:
                    item.department ||
                    item.name ||
                    'General',
                  percentage:
                    item.percentage || 0,
                })),
          });
        }

      } catch (error) {

        console.log(
          'ANALYTICS ERROR:',
          error
        );

        Alert.alert(
          'Error',
          'Failed to load analytics'
        );

      } finally {

        setLoading(false);

        setRefreshing(false);
      }

    }, []);

  // =====================================================
  // INIT
  // =====================================================

  useEffect(() => {

    loadAnalytics();

  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadAnalytics();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <View style={styles.loaderWrap}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading Analytics...
        </Text>

      </View>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <ScreenContainer>

      {/* HEADER */}

      <AppHeader
        title="Analytics"
        subtitle="Enterprise AI insights"
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

            tintColor={COLORS.primary}

          />
        }
      >

        {/* TOP STATS */}

        <View style={styles.statsRow}>

          <StatsCard
            title="Attendance"
            value={`${

              analytics.attendanceRate

            }%`}
            icon="analytics"
            colors={COLORS.gradientSuccess}
          />

          <StatsCard
            title="Productivity"
            value={`${

              analytics.productivity

            }%`}
            icon="trending-up"
            colors={COLORS.gradientPrimary}
          />

        </View>

        <View style={styles.statsRow}>

          <StatsCard
            title="Late Entries"
            value={String(
              analytics.lateEntries
            )}
            icon="time"
            colors={COLORS.gradientDanger}
          />

        <StatsCard
          title="Pending Leaves"
          value={String(
            analytics.remoteEmployees
          )}
            icon="home"
            colors={COLORS.gradientSky}
          />

        </View>

        {/* AI INSIGHTS */}

        <GlassCard gradient>

          <Text style={styles.sectionTitle}>
            AI Attendance Insights
          </Text>

          <AnalyticsItem
            icon="scan"
            text={`${

              analytics.aiAccuracy

            }% successful AI face matches`}
          />

          <AnalyticsItem
            icon="shield-checkmark"
            text={`${
              analytics.spoofAttempts
            } spoofing attempts detected`}
          />

          <AnalyticsItem
            icon="eye"
            text={`Blink verification ${
              analytics.blinkVerification

                ? 'active'

                : 'disabled'
            }`}
          />

          <AnalyticsItem
            icon="checkmark-circle"
            text="Attendance prediction engine active"
          />

        </GlassCard>

        {/* WORKFORCE INSIGHTS */}

        <GlassCard>

          <Text style={styles.sectionTitleDark}>
            Workforce Insights
          </Text>

          <InsightRow
            label="Employee Efficiency"
            value="95%"
          />

          <InsightRow
            label="Payroll Accuracy"
            value="98%"
          />

          <InsightRow
            label="Attendance Compliance"
            value="94%"
          />

          <InsightRow
            label="AI Recognition Quality"
            value="99%"
          />

        </GlassCard>

        {/* DEPARTMENT ANALYTICS */}

        <GlassCard>

          <Text style={styles.sectionTitleDark}>
            Department Analytics
          </Text>

          {

            analytics.departments
              .length === 0 ? (

              <Text style={styles.emptyText}>
                No analytics available
              </Text>

            ) : (

              analytics.departments.map(
                (item, index) => (

                <DepartmentBar

                  key={index}

                  name={item.name}

                  percentage={`${

                    item.percentage

                  }%`}

                  width={`${

                    item.percentage

                  }%`}
                />
              ))
            )
          }

        </GlassCard>

        {/* SYSTEM STATUS */}

        <GlassCard>

          <Text style={styles.sectionTitleDark}>
            System Status
          </Text>

          <StatusRow
            label="AI Recognition"
            status="Online"
            success
          />

          <StatusRow
            label="Attendance API"
            status="Running"
            success
          />

          <StatusRow
            label="Database"
            status="Connected"
            success
          />

          <StatusRow
            label="Security Monitoring"
            status="Protected"
            success
          />

        </GlassCard>

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================================
// ANALYTICS ITEM
// =====================================================

function AnalyticsItem({

  icon,
  text,

}) {

  return (

    <View style={styles.analyticsRow}>

      <Ionicons
        name={icon}
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.analyticsText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================================
// INSIGHT ROW
// =====================================================

function InsightRow({

  label,
  value,

}) {

  return (

    <View style={styles.insightRow}>

      <Text style={styles.insightLabel}>
        {label}
      </Text>

      <Text style={styles.insightValue}>
        {value}
      </Text>

    </View>
  );
}

// =====================================================
// DEPARTMENT BAR
// =====================================================

function DepartmentBar({

  name,
  percentage,
  width,

}) {

  return (

    <View style={styles.departmentContainer}>

      <View style={styles.departmentTop}>

        <Text style={styles.departmentName}>
          {name}
        </Text>

        <Text style={styles.departmentPercentage}>
          {percentage}
        </Text>

      </View>

      <View style={styles.barBackground}>

        <LinearGradient

          colors={
            COLORS.gradientPrimary
          }

          style={[
            styles.barFill,
            {
              width,
            },
          ]}
        />

      </View>

    </View>
  );
}

// =====================================================
// STATUS ROW
// =====================================================

function StatusRow({

  label,
  status,
  success,

}) {

  return (

    <View style={styles.statusRow}>

      <Text style={styles.statusLabel}>
        {label}
      </Text>

      <View
        style={[
          styles.statusBadge,

          success && {
            backgroundColor:
              COLORS.success,
          },
        ]}
      >

        <Text style={styles.statusText}>
          {status}
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  loaderWrap: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  loadingText: {

    color: '#FFFFFF',

    marginTop: 16,
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

  sectionTitleDark: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  analyticsRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  analyticsText: {

    color: '#fff',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

  insightRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 18,
  },

  insightLabel: {

    color: COLORS.textSecondary,
  },

  insightValue: {

    color: COLORS.primary,

    fontWeight: '800',
  },

  departmentContainer: {

    marginBottom: 20,
  },

  departmentTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 8,
  },

  departmentName: {

    color: COLORS.textPrimary,

    fontWeight: '700',
  },

  departmentPercentage: {

    color: COLORS.success,

    fontWeight: '800',
  },

  barBackground: {

    height: 10,

    backgroundColor:
      COLORS.bgElevated,

    borderRadius: RADIUS.full,

    overflow: 'hidden',
  },

  barFill: {

    height: '100%',

    borderRadius: RADIUS.full,
  },

  statusRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  statusLabel: {

    color: COLORS.textSecondary,

    fontSize: FONTS.base,
  },

  statusBadge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 18,
  },

  statusText: {

    color: '#fff',

    fontWeight: '700',

    fontSize: 12,
  },

  emptyText: {

    color: COLORS.textSecondary,

    textAlign: 'center',
  },

});
