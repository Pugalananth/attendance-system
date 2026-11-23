import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  SHADOWS,
} from '../../constants/theme';

import {
  getLeaveRequests,
} from '../../services/hrService';

export default function LeaveManagement({
  navigation,
}) {

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [leaveData, setLeaveData] =
    useState([]);

  const loadLeaves =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await getLeaveRequests();

        setLeaveData(
          response.leaves || []
        );
      } catch (error) {
        console.log(
          'LEAVE LOAD ERROR:',
          error
        );

        Alert.alert(
          'Error',
          'Failed to load leave records'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaves();
  };

  const approvedCount =
    leaveData.filter(
      (i) =>
        String(i.status).toLowerCase() ===
        'approved'
    ).length;

  const pendingCount =
    leaveData.filter(
      (i) =>
        String(i.status).toLowerCase() ===
        'pending'
    ).length;

  const rejectedCount =
    leaveData.filter(
      (i) =>
        String(i.status).toLowerCase() ===
        'rejected'
    ).length;

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
        <Text style={styles.loadingText}>
          Loading Leave Records...
        </Text>
      </View>
    );
  }

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

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.smallText}>
                Enterprise HR Workflow
              </Text>
              <Text style={styles.title}>
                Leave Management
              </Text>
              <Text style={styles.subtitle}>
                Employee leave operations
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.goBack()
              }
            >
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={styles.headerIcon}
              >
                <Ionicons
                  name="calendar"
                  size={28}
                  color="#FFFFFF"
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroTitle}>
                  Leave Analytics
                </Text>
                <Text style={styles.heroSub}>
                  Enterprise leave tracking
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
                value={approvedCount}
                label="Approved"
              />
              <HeroStat
                value={pendingCount}
                label="Pending"
              />
              <HeroStat
                value={rejectedCount}
                label="Rejected"
              />
            </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>
            Employee Leave Records
          </Text>

          {leaveData.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="calendar"
                size={60}
                color="#666"
              />
              <Text style={styles.emptyText}>
                No leave records found
              </Text>
            </View>
          ) : (
            leaveData.map((item, index) => (
              <LeaveCard
                key={
                  item._id ||
                  item.id ||
                  index
                }
                item={item}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function LeaveCard({
  item,
}) {

  const employee =
    item.employee ||
    item.employee_name ||
    'Unknown Employee';

  const status =
    item.status || 'Pending';

  const statusKey =
    String(status).toLowerCase();

  const statusLabel =
    statusKey
      ? statusKey[0].toUpperCase() +
        statusKey.slice(1)
      : 'Pending';

  const isApproved =
    statusKey === 'approved';

  const isRejected =
    statusKey === 'rejected';

  const leaveType =
    item.leave_type ||
    item.type ||
    'Leave';

  const duration =
    item.days ||
    `${item.total_days || 0} Days`;

  const date =
    item.start_date ||
    item.date ||
    '--';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.leftRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee[0]}
            </Text>
          </View>
          <View>
            <Text style={styles.employee}>
              {employee}
            </Text>
            <Text style={styles.department}>
              {item.department || 'General'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                isApproved
                  ? '#00D09722'
                  : isRejected
                    ? '#FF4F6D22'
                    : '#FFB54722',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  isApproved
                    ? '#00D097'
                    : isRejected
                      ? '#FF4F6D'
                      : '#FFB547',
              },
            ]}
          >
            {statusLabel}
          </Text>
        </View>
      </View>

      <InfoRow
        icon="document-text"
        text={leaveType}
      />
      <InfoRow
        icon="time"
        text={duration}
      />
      <InfoRow
        icon="calendar"
        text={date}
      />
    </TouchableOpacity>
  );
}

function InfoRow({
  icon,
  text,
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.textMuted}
      />
      <Text style={styles.infoText}>
        {text}
      </Text>
    </View>
  );
}

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
    color: 'rgba(255,255,255,0.85)',
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
    color: 'rgba(255,255,255,0.82)',
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
    backgroundColor: '#151D35',
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
    backgroundColor: '#4F8EF7',
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
    marginBottom: 14,
  },

  infoText: {
    color: COLORS.textSecondary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
});
