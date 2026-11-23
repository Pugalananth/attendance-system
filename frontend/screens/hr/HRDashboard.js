import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
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
  useAuth,
} from '../../context/AuthContext';

import {
  getHRDashboardSummary,
} from '../../services/hrService';

import {

  COLORS,
  SHADOWS,

} from '../../constants/theme';

export default function HRDashboard({
  navigation,
}) {

  const { logout } = useAuth();

  // =====================================================
  // STATES
  // =====================================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [stats,
    setStats] =
      useState({

        totalEmployees: 0,

        attendanceRate: 0,

        pendingRequests: 0,

        todayAttendance: 0,

        lateEntries: 0,

        absentEmployees: 0,
      });

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  const loadDashboard =
    useCallback(async () => {

      try {

        setLoading(true);

        const result =
          await getHRDashboardSummary();

        if (result.success) {

          const summary =
            result.summary || {};

          setStats({

            totalEmployees:
              summary.totalEmployees ||
              summary.total_employees ||
              0,

            attendanceRate:
              summary.attendanceRate ||
              0,

            pendingRequests:
              summary.pendingRequests ||
              summary.pending_requests ||
              summary.pendingLeaves ||
              summary.pending_leaves ||
              0,

            todayAttendance:
              summary.presentEmployees ||
              0,

            lateEntries:
              summary.lateEntries ||
              0,

            absentEmployees:
              summary.absentEmployees ||
              0,
          });
        }

      } catch (error) {

        console.log(
          'HR DASHBOARD ERROR:',
          error
        );

        Alert.alert(

          'Error',

          'Failed to load dashboard'

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

    loadDashboard();

  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const onRefresh =
    async () => {

    try {

      setRefreshing(true);

      await loadDashboard();

    } catch (e) {

      console.log(e);

    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout =
    () => {

    Alert.alert(

      'Logout',

      'Are you sure you want to logout?',

      [

        {
          text: 'Cancel',
          style: 'cancel',
        },

        {

          text: 'Logout',

          style: 'destructive',

          onPress: async () => {
            await logout();
            navigation.replace(
              'Login'
            );
          },
        },
      ]
    );
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
          Loading HR Dashboard...
        </Text>

      </View>
    );
  }

  // =====================================================
  // UI
  // =====================================================

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

          contentContainerStyle={
            styles.scroll
          }

          refreshControl={

            <RefreshControl

              refreshing={refreshing}

              onRefresh={onRefresh}

              tintColor={COLORS.primary}

            />
          }
        >

          {/* HEADER */}

          <View style={styles.header}>

            <View>

              <Text style={styles.smallText}>
                Enterprise HR System
              </Text>

              <Text style={styles.title}>
                HR Dashboard
              </Text>

              <Text style={styles.subtitle}>
                Human Resource Operations
              </Text>

            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleLogout}
            >

              <LinearGradient

                colors={
                  COLORS.gradientDanger
                }

                style={styles.logoutBtn}
              >

                <Ionicons
                  name="log-out-outline"
                  size={28}
                  color="#FFFFFF"
                />

              </LinearGradient>

            </TouchableOpacity>

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
                  HR Operations Center
                </Text>

                <Text style={styles.heroSub}>
                  Enterprise workforce analytics
                </Text>

              </View>

              <Ionicons
                name="people"
                size={52}
                color="#FFFFFF"
              />

            </View>

            <View style={styles.heroStats}>

              <HeroStat
                value={
                  stats.totalEmployees
                }
                label="Employees"
              />

              <HeroStat
                value={`${

                  stats.attendanceRate

                }%`}
                label="Attendance"
              />

              <HeroStat
                value={
                  stats.todayAttendance
                }
                label="Present"
              />

            </View>

          </LinearGradient>

          {/* ANALYTICS CARDS */}

          <View style={styles.analyticsRow}>

            <AnalyticsCard
              title="Late Entries"
              value={
                stats.lateEntries
              }
              icon="time"
              color="#FFB547"
            />

            <AnalyticsCard
              title="Absent"
              value={
                stats.absentEmployees
              }
              icon="close-circle"
              color="#FF4F6D"
            />

          </View>

          {/* ATTENDANCE */}

          <SectionTitle
            title="Attendance Operations"
          />

          <View style={styles.grid}>

            <QuickCard
              title="Attendance Overview"
              subtitle="Real-time attendance analytics"
              icon="analytics"
              color="#4F8EF7"
              onPress={() =>
                navigation.navigate(
                  'AttendanceOverview'
                )
              }
            />

            <QuickCard
              title="Face Register"
              subtitle="Biometric enrollment"
              icon="scan-circle"
              color="#AA66CC"
              onPress={() =>
                navigation.navigate(
                  'HRFaceRegister'
                )
              }
            />

          </View>

          {/* EMPLOYEE */}

          <SectionTitle
            title="Employee Workflow"
          />

          <View style={styles.grid}>

            <QuickCard
              title="Employee Management"
              subtitle="Manage employee records"
              icon="people"
              color="#FFBB33"
              onPress={() =>
                navigation.navigate(
                  'EmployeeManagement'
                )
              }
            />

          </View>

          {/* LEAVE */}

          <SectionTitle
            title="Leave Workflow"
          />

          <View style={styles.grid}>

            <QuickCard
              title="Leave Approval"
              subtitle="Approve leave requests"
              icon="document-text"
              color="#FF6B6B"
              onPress={() =>
                navigation.navigate(
                  'LeaveApproval'
                )
              }
            />
            <QuickCard
              title="WFH Approval"
              subtitle="Approve WFH requests"
              icon="document-text"
              color="#FF6B6B"
              onPress={() =>
                navigation.navigate(
                  'WFHApproval'
                )
              }
            />

            <QuickCard
              title="Leave Management"
              subtitle="Employee leave records"
              icon="calendar"
              color="#4ECDC4"
              onPress={() =>
                navigation.navigate(
                  'LeaveManagement'
                )
              }
            />

          </View>

          {/* REPORTS */}

          <SectionTitle
            title="Reports & Analytics"
          />

          <View style={styles.grid}>

            <QuickCard
              title="Analytics"
              subtitle="Enterprise HR analytics"
              icon="stats-chart"
              color="#00C851"
              onPress={() =>
                navigation.navigate(
                  'Analytics'
                )
              }
            />

            <QuickCard
              title="Monthly Reports"
              subtitle="Attendance reports"
              icon="bar-chart"
              color="#FF4444"
              onPress={() =>
                navigation.navigate(
                  'MonthlyReport'
                )
              }
            />

          </View>

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================================
// ANALYTICS CARD
// =====================================================

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
          size={26}
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

// =====================================================
// SECTION TITLE
// =====================================================

function SectionTitle({
  title,
}) {

  return (

    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

// =====================================================
// QUICK CARD
// =====================================================

function QuickCard({

  title,
  subtitle,
  icon,
  color,
  onPress,

}) {

  return (

    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >

      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor:
              `${color}22`,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={30}
          color={color}
        />

      </View>

      <Text style={styles.cardText}>
        {title}
      </Text>

      <Text style={styles.cardSub}>
        {subtitle}
      </Text>

    </TouchableOpacity>
  );
}

// =====================================================
// HERO STAT
// =====================================================

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

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050816',
  },

  loaderWrap: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: '#050816',
  },

  loadingText: {

    color: '#FFFFFF',

    marginTop: 16,

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

    marginTop: 4,
  },

  subtitle: {

    color: COLORS.textMuted,

    marginTop: 6,
  },

  logoutBtn: {

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

    marginBottom: 24,

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

    fontSize: 30,

    fontWeight: '800',
  },

  heroLabel: {

    color:
      'rgba(255,255,255,0.82)',

    marginTop: 6,
  },

  analyticsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 24,
  },

  analyticsCard: {

    width: '48%',

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 20,

    alignItems: 'center',

    borderWidth: 1,

    borderColor: '#1E2A45',
  },

  analyticsIcon: {

    width: 62,

    height: 62,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 14,
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

  sectionTitle: {

    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '800',

    marginBottom: 18,

    marginTop: 10,
  },

  grid: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginBottom: 24,
  },

  card: {

    width: '48%',

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    marginBottom: 16,

    borderWidth: 1,

    borderColor: '#1E2A45',
  },

  iconWrap: {

    width: 68,

    height: 68,

    borderRadius: 22,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  cardText: {

    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '800',
  },

  cardSub: {

    color: COLORS.textSecondary,

    marginTop: 8,

    lineHeight: 20,

    fontSize: 13,
  },

});
