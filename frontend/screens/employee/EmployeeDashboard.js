import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  useAuth,
} from '../../context/AuthContext';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,
} from '../../constants/theme';

import {
  getMonthlyReport,
} from '../../services/attendanceService';

export default function EmployeeDashboard({
  navigation,
}) {

  const {
    user,
    logout,
  } = useAuth();

  // =========================================
  // STATES
  // =========================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [todayAttendance,
    setTodayAttendance] =
      useState(null);

  const [analytics,
    setAnalytics] =
      useState({

        attendanceRate: 0,

        totalPresent: 0,

        totalAbsent: 0,

        lateEntries: 0,
      });

  // =========================================
  // LOAD DASHBOARD
  // =========================================

  const loadDashboard = async () => {

    try {
      console.log(
        'USER:',
        user
      );

      setLoading(true);

      // =====================================
      // REPORT DATA
      // =====================================

      const reportResponse =
        await getMonthlyReport();
      
      console.log(
        'REPORT RESPONSE:',
        reportResponse
      );
      if (
        reportResponse?.success
      ) {

        const report =
          reportResponse?.data?.data || {};

        setTodayAttendance({

          check_in: '--',

          status:
            report.present > 0
              ? 'Present'
              : 'Not Marked',

        });

        setAnalytics({

          attendanceRate:
            report.total > 0
              ? Math.round(
                (
                  report.present /
                  report.total
                ) * 100
              )
              : 0,

          totalPresent:
            report.present || 0,

          totalAbsent:
            (report.total || 0) -
            (report.present || 0),

          lateEntries:
            report.late || 0,

        });

      } else {

        setTodayAttendance({

          check_in: '--',

          status: 'Not Marked',

        });

        setAnalytics({

          attendanceRate: 0,

          totalPresent: 0,

          totalAbsent: 0,

          lateEntries: 0,

        });
      }

    } catch (error) {

      console.log(
        'Dashboard Error:',
        error
      );

      setTodayAttendance({

        check_in: '--',

        status: 'Not Marked',

      });

      setAnalytics({

        attendanceRate: 0,

        totalPresent: 0,

        totalAbsent: 0,

        lateEntries: 0,

      });

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // REFRESH
  // =========================================

  const onRefresh =
    async () => {

    try {

      setRefreshing(true);

      await loadDashboard();

    } finally {

      setRefreshing(false);
    }
  };

  // =========================================
  // LOAD ON SCREEN FOCUS
  // =========================================

  useFocusEffect(

    useCallback(() => {

      if (user) {

        loadDashboard();
      }

    }, [user])
  );

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

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

  // =========================================
  // SERVICE CARD
  // =========================================

  const ServiceCard = ({
    icon,
    title,
    subtitle,
    color,
    onPress,
  }) => (

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={onPress}
    >

      <View
        style={[
          styles.cardIcon,
          {
            backgroundColor: color,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={28}
          color="#fff"
        />

      </View>
      

      <View style={styles.cardContent}>

        <Text style={styles.cardTitle}>
          {title}
        </Text>

        <Text style={styles.cardText}>
          {subtitle}
        </Text>

      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={COLORS.textMuted}
      />

    </TouchableOpacity>
  );

  // =========================================
  // LOADING
  // =========================================

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

  return (

    <View style={styles.root}>

      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bg}
      />

      <LinearGradient
        colors={COLORS.gradientDark}
        style={styles.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
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
              Welcome Back 👋
            </Text>

            <Text style={styles.name}>
              {user?.name || 'Employee'}
            </Text>

          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >

            <Ionicons
              name="log-out-outline"
              size={24}
              color="#fff"
            />

          </TouchableOpacity>

        </View>

        {/* PROFILE CARD */}

        <LinearGradient
          colors={COLORS.gradientPrimary}
          style={styles.profileCard}
        >

          <Ionicons
            name="person-circle"
            size={85}
            color="#fff"
          />

          <Text style={styles.profileName}>
            {user?.name || 'Employee'}
          </Text>

          <Text style={styles.profileEmail}>
            {user?.email}
          </Text>

          <View style={styles.badge}>

            <Text style={styles.badgeText}>
              ACTIVE EMPLOYEE
            </Text>

          </View>

        </LinearGradient>

        {/* ANALYTICS */}

        <Text style={styles.sectionTitle}>
          LIVE ANALYTICS
        </Text>

        <View style={styles.statusRow}>

          <LinearGradient
            colors={COLORS.gradientSuccess}
            style={styles.statusCard}
          >

            <Ionicons
              name="analytics"
              size={28}
              color="#fff"
            />

            <Text style={styles.statusTitle}>
              Attendance
            </Text>

            <Text style={styles.statusValue}>
              {
                analytics
                  ?.attendanceRate
              }%
            </Text>

          </LinearGradient>

          <LinearGradient
            colors={COLORS.gradientDanger}
            style={styles.statusCard}
          >

            <Ionicons
              name="time"
              size={28}
              color="#fff"
            />

            <Text style={styles.statusTitle}>
              Late Entries
            </Text>

            <Text style={styles.statusValue}>
              {
                analytics
                  ?.lateEntries
              }
            </Text>

          </LinearGradient>

        </View>

        <View style={styles.statusRow}>

          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.statusCard}
          >
            <Ionicons
              name="checkmark-circle"
              size={28}
              color="#fff"
            />

            <Text style={styles.statusTitle}>
              Present
            </Text>

            <Text style={styles.statusValue}>
              {analytics?.totalPresent}
            </Text>

          </LinearGradient>

          <LinearGradient
            colors={['#ff8c42', '#ff5e62']}
            style={styles.statusCard}
          >
            <Ionicons
              name="close-circle"
              size={28}
              color="#fff"
            />

            <Text style={styles.statusTitle}>
              Absent
            </Text>

            <Text style={styles.statusValue}>
              {analytics?.totalAbsent}
            </Text>

          </LinearGradient>

        </View>

        {/* TODAY STATUS */}

        <Text style={styles.sectionTitle}>
          TODAY STATUS
        </Text>

        <View style={styles.todayCard}>

          <View style={styles.todayRow}>

            <Text style={styles.todayLabel}>
              Check In
            </Text>

            <Text style={styles.todayValue}>
              {
                todayAttendance
                  ?.check_in ||
                '--'
              }
            </Text>

          </View>

          <View style={styles.todayRow}>

            <Text style={styles.todayLabel}>
              Status
            </Text>

            <Text style={styles.todayValue}>
              {
                todayAttendance
                  ?.status ||
                'Not Marked'
              }
            </Text>

          </View>

        </View>

        {/* SERVICES */}

        <Text style={styles.sectionTitle}>
          EMPLOYEE SERVICES
        </Text>

        <ServiceCard
          icon="person-add"
          title="Register Face"
          subtitle="Setup AI face verification"
          color="rgba(79,142,247,0.9)"
          onPress={() =>
            navigation.navigate(
              'FaceRegister'
            )
          }
        />

        <ServiceCard
          icon="scan"
          title="Mark Attendance"
          subtitle="Verify face and check-in"
          color="rgba(0,200,150,0.9)"
          onPress={() =>
            navigation.navigate(
              'FaceAttendance'
            )
          }
        />

        <ServiceCard
          icon="calendar"
          title="Attendance History"
          subtitle="View attendance records"
          color="rgba(255,181,71,0.9)"
          onPress={() =>
            navigation.navigate(
              'AttendanceHistory'
            )
          }
        />

        <ServiceCard
          icon="document-text"
          title="Request Leave"
          subtitle="Apply leave request"
          color="rgba(255,77,106,0.9)"
          onPress={() =>
            navigation.navigate(
              'LeaveRequest'
            )
          }
        />

        <ServiceCard
          icon="person"
          title="My Profile"
          subtitle="Employee profile details"
          color="rgba(0,212,255,0.9)"
          onPress={() =>
            navigation.navigate(
              'EmployeeProfile'
            )
          }
        />

        <ServiceCard
          icon="home"
          title="Work From Home"
          subtitle="WFH approval request"
          color="rgba(255,181,71,0.9)"
          onPress={() =>
            navigation.navigate(
              'WFHRequest'
            )
          }
        />

        {/* FOOTER */}

        <Text style={styles.footer}>
          FaceAttend AI • Enterprise Attendance Platform
        </Text>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
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

  header: {
    marginTop: 60,
    marginHorizontal: SPACING.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  welcome: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
  },

  name: {
    color: COLORS.textPrimary,
    fontSize: FONTS['2xl'],
    fontWeight: '800',
    marginTop: 4,
  },

  logoutButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS['2xl'],
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.primary,
  },

  profileName: {
    color: '#fff',
    fontSize: FONTS.xl,
    fontWeight: '800',
    marginTop: SPACING.md,
  },

  profileEmail: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
    fontSize: FONTS.sm,
  },

  badge: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sm,
    fontWeight: '700',
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.lg,
  },

  statusCard: {
    width: '48%',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
  },

  statusTitle: {
    color: '#fff',
    marginTop: SPACING.md,
    fontSize: FONTS.base,
    fontWeight: '700',
  },

  statusValue: {
    color: '#fff',
    fontSize: FONTS.lg,
    fontWeight: '800',
    marginTop: 5,
  },

  todayCard: {
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  todayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  todayLabel: {
    color: COLORS.textSecondary,
    fontSize: FONTS.base,
  },

  todayValue: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: FONTS.base,
  },

  card: {
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.base,
    fontWeight: '800',
  },

  cardText: {
    color: COLORS.textSecondary,
    marginTop: 5,
    fontSize: FONTS.sm,
    lineHeight: 20,
  },

  footer: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: SPACING['2xl'],
    fontSize: FONTS.xs,
  },

});