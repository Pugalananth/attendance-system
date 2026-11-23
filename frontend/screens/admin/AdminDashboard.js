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
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  getAdminDashboardSummary,
} from '../../services/adminService';

import {
  getAttendance,
} from '../../services/attendanceService';

import AnalyticsChart from
'../../components/charts/AnalyticsChart';

import {

  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

export default function AdminDashboard({
  navigation,
}) {

  const {
    user,
    logout,
  } = useAuth();

  // =====================================
  // STATES
  // =====================================

  const [summary,
    setSummary] =
      useState(null);

  const [attendance,
    setAttendance] =
      useState([]);

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  // =====================================
  // FETCH DATA
  // =====================================

  const loadDashboard =
    useCallback(async () => {

      try {

        setLoading(true);

        // SUMMARY

        const summaryRes =
          await getAdminDashboardSummary();

        if (
          summaryRes.success
        ) {

          setSummary(
            summaryRes.summary
          );
        }

        // ATTENDANCE

          const attendanceRes =
            await getAttendance();

          console.log(
            'Attendance Response:',
            attendanceRes
          );

          if (
           attendanceRes?.success
          )  {

           let attendanceData = [];

          // CASE 1
          // { attendance: [] }

          if (
           Array.isArray(
            attendanceRes?.attendance
           )
         ) {

            attendanceData =
             attendanceRes.attendance;
         }
 
         // CASE 2
         // { data: [] }

         else if (
           Array.isArray(
             attendanceRes?.data
           )
        ) {

           attendanceData =
            attendanceRes.data;
          }
         // CASE 3
         // direct array

          else if (
           Array.isArray(
            attendanceRes
           )
         ) {

          attendanceData =
           attendanceRes;
         }

         setAttendance(
          attendanceData
         );

         } else {

          setAttendance([]);
         }

      } catch (error) {

        console.log(error);

        Alert.alert(
          'Error',
          'Failed to load admin dashboard'
        );

      } finally {

        setLoading(false);

        setRefreshing(false);
      }

    }, []);

  // =====================================
  // INIT
  // =====================================

  useEffect(() => {

    loadDashboard();

  }, []);

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadDashboard();
  };

  // =====================================
  // LOGOUT
  // =====================================

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

          onPress: logout,
        },
      ]
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <View style={styles.loaderContainer}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading Dashboard...
        </Text>

      </View>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (

    <View style={styles.container}>

      <StatusBar
        barStyle="light-content"
      />

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

          showsVerticalScrollIndicator={false}

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

              <Text style={styles.welcome}>
                Enterprise Control Center
              </Text>

              <Text style={styles.title}>
                Admin Dashboard
              </Text>

              <Text style={styles.subtitle}>
                {user?.name}
              </Text>

            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleLogout}
            >

              <LinearGradient

                colors={COLORS.gradientDanger}

                style={styles.logoutBtn}
              >

                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color="#FFFFFF"
                />

              </LinearGradient>

            </TouchableOpacity>

          </View>

          {/* HERO CARD */}

          <LinearGradient

            colors={COLORS.gradientPrimary}

            style={styles.heroCard}
          >

            <View style={styles.heroTop}>

              <View>

                <Text style={styles.heroTitle}>
                  Enterprise AI Monitoring
                </Text>

                <Text style={styles.heroSub}>
                  Real-time attendance intelligence
                </Text>

              </View>

              <Ionicons
                name="shield-checkmark"
                size={48}
                color="#FFFFFF"
              />

            </View>

            <View style={styles.heroStats}>

              <View>

                <Text style={styles.heroValue}>
                  {
                    summary?.attendanceRate || 0
                  }%
                </Text>

                <Text style={styles.heroLabel}>
                  Attendance Rate
                </Text>

              </View>

              <View>

                <Text style={styles.heroValue}>
                  {
                    summary?.activeEmployees || 0
                  }
                </Text>

                <Text style={styles.heroLabel}>
                  Active Employees
                </Text>

              </View>

            </View>

          </LinearGradient>

          {/* STATS */}

          <SectionTitle title="Live Overview" />

          <View style={styles.statsGrid}>

            <StatsCard
              title="Employees"
              value={
                summary?.totalEmployees || 0
              }
              icon="people"
              color="#4F7CFF"
            />

            <StatsCard
              title="Attendance"
              value={`${
                summary?.attendanceRate || 0
              }%`}
              icon="analytics"
              color="#00D097"
            />

            <StatsCard
              title="Late Entries"
              value={
                summary?.lateEntries || 0
              }
              icon="time"
              color="#FFB547"
            />

            <StatsCard
              title="Records"
              value={
                attendance.length || 0
              }
              icon="calendar"
              color="#7C5CFF"
            />

          </View>

          {/* ANALYTICS CHART */}

          <SectionTitle title="Attendance Analytics" />

          <AnalyticsChart

            title="Monthly Attendance"

            subtitle="Enterprise attendance tracking"

            labels={[
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
            ]}

            data={[
              82,
              88,
              91,
              90,
              95,
              97,
            ]}

            suffix="%"
          />

          {/* PRODUCTIVITY CHART */}

          <AnalyticsChart

            title="Employee Productivity"

            subtitle="Company performance overview"

            labels={[
              'Mon',
              'Tue',
              'Wed',
              'Thu',
              'Fri',
            ]}

            data={[
              68,
              72,
              80,
              86,
              92,
            ]}

            suffix="%"
          />

          {/* MANAGEMENT */}

          <SectionTitle title="Management" />

          <View style={styles.actionsGrid}>

            <QuickAction
              label="Employees"
              subtitle="Manage company employees"
              icon="people"
              gradient={COLORS.gradientPrimary}
              onPress={() =>
                navigation.navigate(
                  'ManageEmployees'
                )
              }
            />

            <QuickAction
              label="Live Monitor"
              subtitle="Real-time attendance"
              icon="scan"
              gradient={COLORS.gradientSuccess}
              onPress={() =>
                navigation.navigate(
                  'LiveAttendanceMonitor'
                )
              }
            />

            <QuickAction
              label="Attendance"
              subtitle="Attendance reports"
              icon="calendar"
              gradient={[
                '#FFB547',
                '#FF8A00',
              ]}
              onPress={() =>
                navigation.navigate(
                  'AttendanceHistory'
                )
              }
            />

            <QuickAction
              label="Refresh"
              subtitle="Reload dashboard"
              icon="refresh"
              gradient={[
                '#AA66CC',
                '#7C5CFF',
              ]}
              onPress={onRefresh}
            />

          </View>

          {/* RECENT ATTENDANCE */}

          <SectionTitle
            title="Recent Attendance"
          />

          {
            attendance.length === 0 ? (

              <View style={styles.emptyCard}>

                <Ionicons
                  name="time-outline"
                  size={44}
                  color={COLORS.textMuted}
                />

                <Text style={styles.emptyText}>
                  No attendance records found
                </Text>

              </View>

            ) : (

              attendance
                .slice(0, 6)
                .map((item, index) => (

                <View
                  key={index}
                  style={styles.recordCard}
                >

                  {/* AVATAR */}

                  <LinearGradient

                    colors={
                      COLORS.gradientPrimary
                    }

                    style={styles.avatar}
                  >

                    <Text
                      style={
                        styles.avatarText
                      }
                    >
                      {
                        item.name?.charAt(0)
                      }
                    </Text>

                  </LinearGradient>

                  {/* INFO */}

                  <View
                    style={{ flex: 1 }}
                  >

                    <Text
                      style={
                        styles.recordName
                      }
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={
                        styles.recordMeta
                      }
                    >
                      {
                        item.employee_id
                      }
                      {' • '}
                      {item.role}
                    </Text>

                  </View>

                  {/* STATUS */}

                  <View
                    style={[
                      styles.statusBadge,

                      {
                        backgroundColor:

                          item.status ===
                          'Present'

                          ? '#00D09722'

                          : '#FF4F6D22',
                      },
                    ]}
                  >

                    <Text
                      style={[
                        styles.statusText,

                        {
                          color:

                            item.status ===
                            'Present'

                            ? '#00D097'

                            : '#FF4F6D',
                        },
                      ]}
                    >
                      {item.status}
                    </Text>

                  </View>

                </View>
              ))
            )
          }

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

/* ===================================== */
/* SECTION TITLE */
/* ===================================== */

function SectionTitle({
  title,
}) {

  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

/* ===================================== */
/* STATS CARD */
/* ===================================== */

function StatsCard({

  title,
  value,
  icon,
  color,

}) {

  return (

    <LinearGradient

      colors={[
        COLORS.bgCard,
        COLORS.bgElevated,
      ]}

      style={styles.statCard}
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
          size={24}
          color={color}
        />

      </View>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statTitle}>
        {title}
      </Text>

    </LinearGradient>
  );
}

/* ===================================== */
/* QUICK ACTION */
/* ===================================== */

function QuickAction({

  label,
  subtitle,
  icon,
  gradient,
  onPress,

}) {

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.quickCard}
      onPress={onPress}
    >

      <LinearGradient

        colors={[
          '#151D35',
          '#101728',
        ]}

        style={styles.quickGradient}
      >

        <LinearGradient
          colors={gradient}
          style={styles.quickIcon}
        >

          <Ionicons
            name={icon}
            size={28}
            color="#FFFFFF"
          />

        </LinearGradient>

        <Text style={styles.quickText}>
          {label}
        </Text>

        <Text style={styles.quickSub}>
          {subtitle}
        </Text>

      </LinearGradient>

    </TouchableOpacity>
  );
}

/* ===================================== */
/* STYLES */
/* ===================================== */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },

  loadingText: {
    color: COLORS.textPrimary,
    marginTop: 14,
    fontSize: FONTS.base,
  },

  scroll: {
    padding: SPACING.lg,
    paddingBottom: 80,
  },

  header: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: SPACING.xl,
  },

  welcome: {

    color: COLORS.textSecondary,

    fontSize: FONTS.base,

    marginBottom: 4,
  },

  title: {

    color: COLORS.textPrimary,

    fontSize: 32,

    fontWeight: '800',
  },

  subtitle: {

    color: COLORS.textMuted,

    marginTop: 6,
  },

  logoutBtn: {

    width: 54,

    height: 54,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',

    ...SHADOWS.lg,
  },

  heroCard: {

    borderRadius: RADIUS['2xl'],

    padding: SPACING.xl,

    marginBottom: SPACING.xl,

    ...SHADOWS.primary,
  },

  heroTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: SPACING.xl,
  },

  heroTitle: {

    color: '#FFFFFF',

    fontSize: 22,

    fontWeight: '800',
  },

  heroSub: {

    color: 'rgba(255,255,255,0.85)',

    marginTop: 6,
  },

  heroStats: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  heroValue: {

    color: '#FFFFFF',

    fontSize: 30,

    fontWeight: '800',
  },

  heroLabel: {

    color: 'rgba(255,255,255,0.8)',

    marginTop: 6,
  },

  sectionTitle: {

    color: COLORS.textPrimary,

    fontSize: 20,

    fontWeight: '700',

    marginBottom: 18,

    marginTop: 10,
  },

  statsGrid: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginBottom: 10,
  },

  statCard: {

    width: '48%',

    borderRadius: RADIUS.xl,

    padding: 18,

    marginBottom: 16,

    borderWidth: 1,

    borderColor: COLORS.border,

    ...SHADOWS.md,
  },

  iconWrap: {

    width: 50,

    height: 50,

    borderRadius: 16,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 15,
  },

  statValue: {

    color: COLORS.textPrimary,

    fontSize: 28,

    fontWeight: '800',
  },

  statTitle: {

    color: COLORS.textSecondary,

    marginTop: 4,
  },

  actionsGrid: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginBottom: 20,
  },

  quickCard: {

    width: '48%',

    marginBottom: 18,
  },

  quickGradient: {

    borderRadius: 24,

    padding: 20,

    borderWidth: 1,

    borderColor: COLORS.border,

    minHeight: 180,

    justifyContent: 'space-between',

    ...SHADOWS.lg,
  },

  quickIcon: {

    width: 60,

    height: 60,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  quickText: {

    color: COLORS.textPrimary,

    fontSize: 17,

    fontWeight: '700',
  },

  quickSub: {

    color: COLORS.textSecondary,

    fontSize: 13,

    marginTop: 6,

    lineHeight: 20,
  },

  emptyCard: {

    backgroundColor: COLORS.bgCard,

    borderRadius: RADIUS.xl,

    padding: 40,

    alignItems: 'center',

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  emptyText: {

    color: COLORS.textMuted,

    marginTop: 14,
  },

  recordCard: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: COLORS.bgCard,

    borderRadius: RADIUS.xl,

    padding: 18,

    marginBottom: 14,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  avatar: {

    width: 54,

    height: 54,

    borderRadius: 18,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  avatarText: {

    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '700',
  },

  recordName: {

    color: COLORS.textPrimary,

    fontSize: 16,

    fontWeight: '700',
  },

  recordMeta: {

    color: COLORS.textSecondary,

    marginTop: 4,

    fontSize: 13,
  },

  statusBadge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 14,
  },

  statusText: {

    fontWeight: '700',

    fontSize: 12,
  },

});