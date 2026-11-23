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
  ActivityIndicator,
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
  getAttendanceReport,
} from '../../services/hrService';

import {

  COLORS,
  SHADOWS,

} from '../../constants/theme';

export default function AttendanceOverviewScreen({
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

  const [attendanceData,
    setAttendanceData] =
      useState([]);

  // =====================================================
  // LOAD ATTENDANCE
  // =====================================================

  const loadAttendance =
    useCallback(async () => {

      try {

        setLoading(true);

        const response =
          await getAttendanceReport();

        if (!response?.success) {
          throw new Error(
            response?.message ||
            'Failed to load attendance'
          );
        }

        const records =
          response?.records ||
          response?.data?.data?.records ||
          response?.data?.records ||
          response?.data ||
          [];

        setAttendanceData(
          Array.isArray(records)
            ? records
            : []
        );

      } catch (error) {

        console.log(
          'ATTENDANCE ERROR:',
          error
        );

        Alert.alert(

          'Error',

          error?.message ||
          'Failed to load attendance'

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

    loadAttendance();

  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const onRefresh =
    async () => {

    try {

      setRefreshing(true);

      await loadAttendance();

    } catch (e) {

      console.log(e);
    }
  };

  // =====================================================
  // ANALYTICS
  // =====================================================

  const presentCount =
    attendanceData.filter(
      (i) =>
        i.status === 'Present'
    ).length;

  const lateCount =
    attendanceData.filter(
      (i) =>
        i.status === 'Late'
    ).length;

  const absentCount =
    attendanceData.filter(
      (i) =>
        i.status === 'Absent'
    ).length;

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
          Loading Attendance...
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
                Enterprise HR Analytics
              </Text>

              <Text style={styles.title}>
                Attendance Overview
              </Text>

              <Text style={styles.subtitle}>
                Real-time attendance monitoring
              </Text>

            </View>

            <LinearGradient

              colors={
                COLORS.gradientPrimary
              }

              style={styles.headerIcon}
            >

              <Ionicons
                name="analytics"
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
                  Attendance Analytics
                </Text>

                <Text style={styles.heroSub}>
                  Enterprise attendance operations
                </Text>

              </View>

              <Ionicons
                name="stats-chart"
                size={50}
                color="#FFFFFF"
              />

            </View>

            <View style={styles.heroStats}>

              <HeroStat
                value={presentCount}
                label="Present"
              />

              <HeroStat
                value={lateCount}
                label="Late"
              />

              <HeroStat
                value={absentCount}
                label="Absent"
              />

            </View>

          </LinearGradient>

          {/* SECTION */}

          <Text style={styles.sectionTitle}>
            Employee Attendance
          </Text>

          {

            attendanceData.length === 0 ? (

              <View style={styles.emptyCard}>

                <Ionicons
                  name="document-text"
                  size={60}
                  color="#666"
                />

                <Text style={styles.emptyText}>
                  No attendance records found
                </Text>

              </View>

            ) : (

              attendanceData.map((item, index) => (

                <AttendanceCard
                  key={

                    item._id ||

                    item.id ||

                    index
                  }

                  item={item}
                />
              ))
            )
          }

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================================
// ATTENDANCE CARD
// =====================================================

function AttendanceCard({
  item,
}) {

  const status =
    item.status || 'Absent';

  const isPresent =
    status === 'Present';

  const isLate =
    status === 'Late';

  const employeeName =

    item.employee_name ||

    item.employee ||

    'Unknown Employee';

  const department =

    item.department ||

    'No Department';

  const checkIn =

    item.check_in ||

    item.checkIn ||

    '--';

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
    >

      {/* TOP */}

      <View style={styles.cardTop}>

        <View style={styles.leftRow}>

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              {employeeName[0]}
            </Text>

          </View>

          <View>

            <Text style={styles.employee}>
              {employeeName}
            </Text>

            <Text style={styles.department}>
              {department}
            </Text>

          </View>

        </View>

        {/* STATUS */}

        <View
          style={[

            styles.statusBadge,

            {
              backgroundColor:

                isPresent

                  ? '#00D09722'

                  : isLate

                  ? '#FFB54722'

                  : '#FF4F6D22',
            },
          ]}
        >

          <Text
            style={[

              styles.statusText,

              {
                color:

                  isPresent

                    ? '#00D097'

                    : isLate

                    ? '#FFB547'

                    : '#FF4F6D',
              },
            ]}
          >
            {status}
          </Text>

        </View>

      </View>

      {/* CHECK-IN */}

      <View style={styles.infoRow}>

        <Ionicons
          name="time"
          size={18}
          color={COLORS.textMuted}
        />

        <Text style={styles.infoText}>
          Check-In: {checkIn}
        </Text>

      </View>

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

    fontSize: 30,

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
  },

  emptyCard: {

    backgroundColor: '#151D35',

    borderRadius: 24,

    padding: 40,

    alignItems: 'center',

    justifyContent: 'center',
  },

  emptyText: {

    color: '#999',

    marginTop: 20,

    fontSize: 16,
  },

  card: {

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    marginBottom: 18,

    borderWidth: 1,

    borderColor: '#1E2A45',
  },

  cardTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 20,
  },

  leftRow: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  avatar: {

    width: 62,

    height: 62,

    borderRadius: 20,

    backgroundColor:
      '#4F8EF7',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  avatarText: {

    color: '#FFFFFF',

    fontSize: 22,

    fontWeight: '800',
  },

  employee: {

    color: '#FFFFFF',

    fontSize: 18,

    fontWeight: '800',
  },

  department: {

    color: COLORS.textSecondary,

    marginTop: 6,
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

  infoRow: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  infoText: {

    color: COLORS.textSecondary,

    marginLeft: 10,

    flex: 1,
  },

});
