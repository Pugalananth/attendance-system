import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

export default function AdminApprovalScreen() {

  // =====================================
  // REQUESTS
  // =====================================

  const [requests,
    setRequests] =
      useState([

    {
      id: 1,
      employee: 'Arun Kumar',
      type: 'Leave Request',
      days: '3 Days',
      reason:
        'Medical leave request',
      status: 'Pending',
      icon: 'document-text',
      color: '#FFB547',
    },

    {
      id: 2,
      employee: 'Sophia',
      type: 'WFH Request',
      days: '2 Days',
      reason:
        'Remote project work',
      status: 'Pending',
      icon: 'home',
      color: '#00D097',
    },

    {
      id: 3,
      employee: 'David',
      type: 'Leave Request',
      days: '1 Day',
      reason:
        'Personal emergency',
      status: 'Pending',
      icon: 'calendar',
      color: '#7C5CFF',
    },

  ]);

  // =====================================
  // APPROVE
  // =====================================

  const approveRequest =
    (id) => {

    setRequests(

      requests.map((item) =>

        item.id === id

          ? {
              ...item,
              status: 'Approved',
            }

          : item
      )
    );
  };

  // =====================================
  // REJECT
  // =====================================

  const rejectRequest =
    (id) => {

    setRequests(

      requests.map((item) =>

        item.id === id

          ? {
              ...item,
              status: 'Rejected',
            }

          : item
      )
    );
  };

  // =====================================
  // STATS
  // =====================================

  const pendingCount =
    requests.filter(
      (r) =>
        r.status === 'Pending'
    ).length;

  const approvedCount =
    requests.filter(
      (r) =>
        r.status === 'Approved'
    ).length;

  const rejectedCount =
    requests.filter(
      (r) =>
        r.status === 'Rejected'
    ).length;

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
        >

          {/* HEADER */}

          <View style={styles.header}>

            <View>

              <Text style={styles.smallText}>
                Enterprise Workflow
              </Text>

              <Text style={styles.title}>
                Approval Center
              </Text>

              <Text style={styles.subtitle}>
                HR approval management
              </Text>

            </View>

            <LinearGradient

              colors={
                COLORS.gradientPrimary
              }

              style={styles.headerIcon}
            >

              <Ionicons
                name="shield-checkmark"
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
                  Approval Workflow
                </Text>

                <Text style={styles.heroSub}>
                  Enterprise HR operations
                </Text>

              </View>

              <Ionicons
                name="git-network"
                size={48}
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

          {/* REQUESTS */}

          <Text style={styles.sectionTitle}>
            Pending Requests
          </Text>

          {

            requests.map((item) => (

              <RequestCard

                key={item.id}

                item={item}

                onApprove={
                  approveRequest
                }

                onReject={
                  rejectRequest
                }
              />
            ))
          }

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================
// REQUEST CARD
// =====================================

function RequestCard({

  item,
  onApprove,
  onReject,

}) {

  const isApproved =
    item.status === 'Approved';

  const isRejected =
    item.status === 'Rejected';

  return (

    <View style={styles.card}>

      {/* TOP */}

      <View style={styles.cardTop}>

        <View style={styles.leftRow}>

          <View
            style={[

              styles.iconWrap,

              {
                backgroundColor:
                  `${item.color}22`,
              },
            ]}
          >

            <Ionicons
              name={item.icon}
              size={26}
              color={item.color}
            />

          </View>

          <View>

            <Text style={styles.employee}>
              {item.employee}
            </Text>

            <Text style={styles.type}>
              {item.type}
            </Text>

          </View>

        </View>

        {/* STATUS */}

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
            {item.status}
          </Text>

        </View>

      </View>

      {/* DETAILS */}

      <View style={styles.detailRow}>

        <Ionicons
          name="time"
          size={18}
          color={COLORS.textMuted}
        />

        <Text style={styles.detailText}>
          {item.days}
        </Text>

      </View>

      <View style={styles.detailRow}>

        <Ionicons
          name="document-text"
          size={18}
          color={COLORS.textMuted}
        />

        <Text style={styles.detailText}>
          {item.reason}
        </Text>

      </View>

      {/* ACTIONS */}

      {
        item.status === 'Pending' && (

          <View style={styles.actionRow}>

            {/* APPROVE */}

            <TouchableOpacity

              style={[
                styles.actionBtn,

                {
                  backgroundColor:
                    '#00D097',
                },
              ]}

              onPress={() =>
                onApprove(item.id)
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

            {/* REJECT */}

            <TouchableOpacity

              style={[
                styles.actionBtn,

                {
                  backgroundColor:
                    '#FF4F6D',
                },
              ]}

              onPress={() =>
                onReject(item.id)
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
        )
      }

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
// STYLES
// =====================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050816',
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

    marginBottom: 28,
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

  iconWrap: {

    width: 62,

    height: 62,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  employee: {

    color: '#FFFFFF',

    fontSize: 18,

    fontWeight: '800',
  },

  type: {

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

  detailRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 14,
  },

  detailText: {

    color: COLORS.textSecondary,

    marginLeft: 10,

    flex: 1,

    lineHeight: 22,
  },

  actionRow: {

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