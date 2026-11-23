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
  approveLeave,
  getLeaveRequests,
  rejectLeave,
} from '../../services/hrService';

export default function LeaveApprovalScreen({
  navigation,
}) {

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [requests, setRequests] =
    useState([]);

  const loadLeaves =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await getLeaveRequests();

        if (!response?.success) {
          throw new Error(
            response?.message ||
            'Failed to load leave requests'
          );
        }

        const leaves =
          response?.leaves ||
          response?.data?.data?.records ||
          response?.data?.records ||
          response?.data ||
          [];

        setRequests(
          Array.isArray(leaves)
            ? leaves
            : []
        );
      } catch (error) {
        console.log(
          'LEAVE ERROR:',
          error
        );

        Alert.alert(
          'Error',
          error?.message ||
          'Failed to load leave requests'
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

  const approveRequest =
    async (id) => {
      try {
        const result =
          await approveLeave(id);

        if (!result?.success) {
          throw new Error(
            result?.message ||
            'Approval failed'
          );
        }

        setRequests((items) =>
          items.map((item) =>
            item._id === id ||
            item.id === id
              ? {
                ...item,
                status: 'Approved',
                status_label: 'Approved',
              }
              : item
          )
        );

        Alert.alert(
          'Approved',
          'Leave request approved'
        );
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          error?.message ||
          'Approval failed'
        );
      }
    };

  const rejectRequest =
    async (id) => {
      try {
        const result =
          await rejectLeave(id);

        if (!result?.success) {
          throw new Error(
            result?.message ||
            'Reject failed'
          );
        }

        setRequests((items) =>
          items.map((item) =>
            item._id === id ||
            item.id === id
              ? {
                ...item,
                status: 'Rejected',
                status_label: 'Rejected',
              }
              : item
          )
        );

        Alert.alert(
          'Rejected',
          'Leave request rejected'
        );
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          error?.message ||
          'Reject failed'
        );
      }
    };

  const pendingCount =
    requests.filter(
      (i) =>
        String(i.status).toLowerCase() ===
        'pending'
    ).length;

  const approvedCount =
    requests.filter(
      (i) =>
        String(i.status).toLowerCase() ===
        'approved'
    ).length;

  const rejectedCount =
    requests.filter(
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
          Loading Leave Requests...
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
                Enterprise Workflow
              </Text>
              <Text style={styles.title}>
                Leave Approval
              </Text>
              <Text style={styles.subtitle}>
                HR leave workflow management
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
                  name="document-text"
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
                  Leave Workflow
                </Text>
                <Text style={styles.heroSub}>
                  Enterprise approval operations
                </Text>
              </View>
              <Ionicons
                name="git-network"
                size={50}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.heroStats}>
              <HeroStat
                value={pendingCount}
                label="Pending"
              />
              <HeroStat
                value={approvedCount}
                label="Approved"
              />
              <HeroStat
                value={rejectedCount}
                label="Rejected"
              />
            </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>
            Employee Leave Requests
          </Text>

          {requests.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons
                name="document-text"
                size={60}
                color="#666"
              />
              <Text style={styles.emptyText}>
                No leave requests found
              </Text>
            </View>
          ) : (
            requests.map((item, index) => (
              <LeaveCard
                key={
                  item._id ||
                  item.id ||
                  index
                }
                item={item}
                onApprove={
                  approveRequest
                }
                onReject={
                  rejectRequest
                }
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
  onApprove,
  onReject,
}) {

  const id =
    item._id ||
    item.id;

  const employee =
    item.employee ||
    item.employee_name ||
    'Unknown Employee';

  const employeeId =
    item.employee_id ||
    '--';

  const leaveType =
    item.leave_type ||
    item.type ||
    'Leave';

  const duration =
    item.days ||
    `${item.total_days || 0} Days`;

  const from =
    item.start_date ||
    item.date ||
    '--';

  const to =
    item.end_date ||
    '--';

  const status =
    item.status || 'Pending';

  const statusKey =
    String(status).toLowerCase();

  const statusLabel =
    item.status_label ||
    (
      statusKey
        ? statusKey[0].toUpperCase() +
          statusKey.slice(1)
        : 'Pending'
    );

  const isApproved =
    statusKey === 'approved';

  const isRejected =
    statusKey === 'rejected';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.leftRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee[0]}
            </Text>
          </View>

          <View>
            <Text style={styles.employeeName}>
              {employee}
            </Text>
            <Text style={styles.employeeId}>
              {employeeId}
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
        icon="business"
        text={
          item.department ||
          'General'
        }
      />
      <InfoRow
        icon="document"
        text={leaveType}
      />
      <InfoRow
        icon="calendar"
        text={`${from} - ${to}`}
      />
      <InfoRow
        icon="time"
        text={duration}
      />
      <InfoRow
        icon="chatbox"
        text={
          item.reason ||
          'No reason provided'
        }
      />

      {statusKey === 'pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  '#00D097',
              },
            ]}
            onPress={() =>
              onApprove(id)
            }
          >
            <Ionicons
              name="checkmark"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.btnText}>
              Approve
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  '#FF4F6D',
              },
            ]}
            onPress={() =>
              onReject(id)
            }
          >
            <Ionicons
              name="close"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.btnText}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
        color="#999"
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

  employeeName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  employeeId: {
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

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  actionBtn: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },

  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
});
