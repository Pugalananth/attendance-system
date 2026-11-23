import React, {
  useState,
  useCallback,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

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

  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

import {
  getAttendance,
  getMonthlyReport,
} from '../../services/attendanceService';

export default function AttendanceHistoryScreen() {

  // =====================================
  // STATES
  // =====================================

  const [attendance,
    setAttendance] =
      useState([]);

  const [filtered,
    setFiltered] =
      useState([]);

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [search,
    setSearch] =
      useState('');

  // =====================================
  // FETCH ATTENDANCE
  // =====================================

  const fetchAttendance =
    async () => {

      try {

        const response =
          await getAttendance();

        console.log(
          'Attendance Response:',
          response
        );

        let records = [];

        if (
          Array.isArray(
            response?.data
          )
        ) {
          records = response.data;
        }
        else if (
          Array.isArray(
            response?.data?.data
          )
        ) {
          records = response.data.data;
        }

        setAttendance(records);
        setFiltered(records);
    } catch (error) {

      console.log(
        'Attendance Error:',
        error
      );

      setAttendance([]);
      setFiltered([]);

    } finally {

      setLoading(false);

      setRefreshing(false);
    }
  };

  // =====================================
  // SCREEN FOCUS
  // =====================================

  useFocusEffect(

    useCallback(() => {

      fetchAttendance();

    }, [])
  );

  // =====================================
  // SEARCH
  // =====================================

  const handleSearch =
    (text) => {

    setSearch(text);

    const filteredData =
      attendance.filter((item) =>

        item?.name
          ?.toLowerCase()
          ?.includes(
            text.toLowerCase()
          ) ||

        item?.employee_id
          ?.toLowerCase()
          ?.includes(
            text.toLowerCase()
          )
      );

    setFiltered(
      filteredData
    );
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await fetchAttendance();
  };

  // =====================================
  // WORK HOURS
  // =====================================

  const calculateHours =
    (checkIn, checkOut) => {

    if (
      !checkIn ||
      !checkOut
    ) {

      return '--';
    }

    return '8h 30m';
  };

  // =====================================
  // EMPTY
  // =====================================

  const EmptyComponent =
    () => (

    <View style={styles.emptyContainer}>

      <Ionicons
        name="calendar-outline"
        size={70}
        color={COLORS.textMuted}
      />

      <Text style={styles.emptyTitle}>
        No Attendance Records
      </Text>

      <Text style={styles.emptyText}>
        Attendance history will appear here
      </Text>

    </View>
  );

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
          Loading Attendance...
        </Text>

      </View>
    );
  }

  // =====================================
  // RENDER ITEM
  // =====================================

  const renderAttendanceItem =
    ({ item }) => (

    <View style={styles.card}>

      {/* TOP */}

      <View style={styles.topRow}>

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
              item?.name
                ?.charAt(0) || 'U'
            }
          </Text>

        </LinearGradient>

        <View style={{ flex: 1 }}>

          <Text style={styles.name}>
            {
              item?.name ||
              'Unknown User'
            }
          </Text>

          <Text style={styles.meta}>
            {
              item?.employee_id ||
              'N/A'
            }
            {' • '}
            {
              item?.role ||
              'Employee'
            }
          </Text>

        </View>

        <View
          style={[

            styles.statusBadge,

            {
              backgroundColor:

                item?.status ===
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

                  item?.status ===
                  'Present'

                  ? '#00D097'

                  : '#FF4F6D',
              },
            ]}
          >
            {
              item?.status ||
              'Unknown'
            }
          </Text>

        </View>

      </View>

      {/* DETAILS */}

      <View style={styles.detailsRow}>

        <InfoCard
          icon="log-in"
          label="Check In"
          value={
            item?.check_in ||
            '--'
          }
          color="#00D097"
        />

        <InfoCard
          icon="log-out"
          label="Check Out"
          value={
            item?.check_out ||
            '--'
          }
          color="#FFB547"
        />

      </View>

      <View style={styles.detailsRow}>

        <InfoCard
          icon="time"
          label="Working Hours"
          value={
            calculateHours(
              item?.check_in,
              item?.check_out
            )
          }
          color="#7C5CFF"
        />

        <InfoCard
          icon="calendar"
          label="Date"
          value={
            item?.date ||
            '--'
          }
          color="#4F7CFF"
        />

      </View>

    </View>
  );

  // =====================================
  // UI
  // =====================================

  return (

    <View style={styles.container}>

      <LinearGradient

        colors={[
          '#050816',
          '#0A0A1A',
          '#101528',
        ]}

        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView
        style={{ flex: 1 }}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Attendance History
          </Text>

          <Text style={styles.subtitle}>
            Enterprise attendance timeline
          </Text>

        </View>

        {/* ANALYTICS */}

        <View style={styles.analyticsRow}>

          <LinearGradient
            colors={COLORS.gradientSuccess}
            style={styles.analyticsCard}
          >

            <Ionicons
              name="checkmark-circle"
              size={26}
              color="#FFFFFF"
            />

            <Text style={styles.analyticsValue}>
              {
                attendance?.length || 0
              }
            </Text>

            <Text style={styles.analyticsLabel}>
              Records
            </Text>

          </LinearGradient>

          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.analyticsCard}
          >

            <Ionicons
              name="analytics"
              size={26}
              color="#FFFFFF"
            />

            <Text style={styles.analyticsValue}>
              Min 75%
            </Text>

            <Text style={styles.analyticsLabel}>
              Attendance
            </Text>

          </LinearGradient>

        </View>

        {/* SEARCH */}

        <View style={styles.searchBox}>

          <Ionicons
            name="search"
            size={20}
            color={COLORS.textMuted}
          />

          <TextInput
            placeholder="Search attendance..."
            placeholderTextColor={
              COLORS.textMuted
            }
            value={search}
            onChangeText={
              handleSearch
            }
            style={styles.searchInput}
          />

        </View>

        {/* LIST */}

        <FlatList

          data={filtered}

          keyExtractor={(
            item,
            index
          ) =>
            index.toString()
          }

          renderItem={
            renderAttendanceItem
          }

          showsVerticalScrollIndicator={
            false
          }

          ListEmptyComponent={
            EmptyComponent
          }

          contentContainerStyle={{
            paddingBottom: 120,
          }}

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
        />

      </SafeAreaView>

    </View>
  );
}

/* ===================================== */
/* INFO CARD */
/* ===================================== */

function InfoCard({

  icon,
  label,
  value,
  color,

}) {

  return (

    <View style={styles.infoCard}>

      <View
        style={[
          styles.infoIcon,

          {
            backgroundColor:
              `${color}22`,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={18}
          color={color}
        />

      </View>

      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>

    </View>
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

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },

  loadingText: {
    color: COLORS.textPrimary,
    marginTop: 12,
    fontSize: FONTS.base,
  },

  header: {
    padding: 20,
    paddingBottom: 10,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '800',
  },

  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 6,
  },

  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  analyticsCard: {
    width: '48%',
    borderRadius: 22,
    padding: 20,
  },

  analyticsValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 14,
  },

  analyticsLabel: {
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.9,
  },

  searchBox: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor:
      COLORS.bgCard,

    marginHorizontal: 20,

    borderRadius: 18,

    paddingHorizontal: 16,

    height: 56,

    borderWidth: 1,

    borderColor: COLORS.border,

    marginBottom: 20,
  },

  searchInput: {

    flex: 1,

    color: COLORS.textPrimary,

    marginLeft: 10,

    fontSize: 15,
  },

  card: {

    backgroundColor:
      COLORS.bgCard,

    marginHorizontal: 20,

    marginBottom: 16,

    borderRadius: 24,

    padding: 18,

    borderWidth: 1,

    borderColor: COLORS.border,

    ...SHADOWS.md,
  },

  topRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 20,
  },

  avatar: {

    width: 56,

    height: 56,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  avatarText: {

    color: '#FFFFFF',

    fontSize: 22,

    fontWeight: '700',
  },

  name: {

    color: COLORS.textPrimary,

    fontSize: 18,

    fontWeight: '700',
  },

  meta: {

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

  detailsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 14,
  },

  infoCard: {

    width: '48%',

    backgroundColor:
      COLORS.bgElevated,

    borderRadius: 18,

    padding: 16,
  },

  infoIcon: {

    width: 38,

    height: 38,

    borderRadius: 12,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 10,
  },

  infoLabel: {

    color: COLORS.textSecondary,

    fontSize: 12,

    marginBottom: 6,
  },

  infoValue: {

    color: COLORS.textPrimary,

    fontSize: 15,

    fontWeight: '700',
  },

  emptyContainer: {

    alignItems: 'center',

    marginTop: 80,
  },

  emptyTitle: {

    color: COLORS.textPrimary,

    fontSize: 20,

    fontWeight: '800',

    marginTop: 20,
  },

  emptyText: {

    color: COLORS.textSecondary,

    marginTop: 10,

    textAlign: 'center',
  },

});