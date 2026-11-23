import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
  SPACING,
  RADIUS,
} from '../../constants/theme';

export default function LiveAttendanceMonitorScreen({
  navigation,
}) {

  // =====================================
  // MOCK LIVE DATA
  // =====================================

  const [attendance] =
    useState([

      {
        id: '1',
        name: 'Arun Kumar',
        time: '09:02 AM',
        status: 'Checked In',
        ai: 'Verified',
      },

      {
        id: '2',
        name: 'Sophia',
        time: '09:08 AM',
        status: 'WFH',
        ai: 'Verified',
      },

      {
        id: '3',
        name: 'David',
        time: '09:45 AM',
        status: 'Late',
        ai: 'Warning',
      },

      {
        id: '4',
        name: 'Rahul',
        time: '--',
        status: 'Absent',
        ai: 'Offline',
      },
    ]);

  // =====================================
  // RENDER CARD
  // =====================================

  const renderAttendanceCard =
    ({ item }) => (

    <GlassCard>

      {/* TOP */}

      <View style={styles.topRow}>

        {/* USER */}

        <View style={styles.userRow}>

          <View style={styles.avatar}>

            <Ionicons
              name="person"
              size={22}
              color="#FFFFFF"
            />

          </View>

          <View>

            <Text style={styles.name}>
              {item?.name || 'Unknown'}
            </Text>

            <Text style={styles.time}>
              {item?.time || '--'}
            </Text>

          </View>

        </View>

        {/* STATUS */}

        <View
          style={[

            styles.statusBadge,

            item?.status ===
            'Checked In' && {
              backgroundColor:
                COLORS.success,
            },

            item?.status ===
            'Late' && {
              backgroundColor:
                COLORS.warning,
            },

            item?.status ===
            'Absent' && {
              backgroundColor:
                COLORS.error,
            },

            item?.status ===
            'WFH' && {
              backgroundColor:
                COLORS.primary,
            },
          ]}
        >

          <Text style={styles.statusText}>
            {item?.status || 'Unknown'}
          </Text>

        </View>

      </View>

      {/* AI ROW */}

      <View style={styles.aiRow}>

        <View style={styles.aiLeft}>

          <Ionicons
            name="shield-checkmark"
            size={18}
            color="#00FFB2"
          />

          <Text style={styles.aiLabel}>
            AI Verification
          </Text>

        </View>

        <Text
          style={[

            styles.aiStatus,

            item?.ai ===
            'Verified' && {
              color:
                COLORS.success,
            },

            item?.ai ===
            'Warning' && {
              color:
                COLORS.warning,
            },

            item?.ai ===
            'Offline' && {
              color:
                COLORS.error,
            },
          ]}
        >
          {item?.ai || 'Unknown'}
        </Text>

      </View>

    </GlassCard>
  );

  // =====================================
  // UI
  // =====================================

  return (

    <ScreenContainer>

      <FlatList

        data={attendance}

        keyExtractor={(item) =>
          item?.id?.toString()
        }

        renderItem={
          renderAttendanceCard
        }

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingBottom: 120,
        }}

        ListHeaderComponent={

          <>

            {/* HEADER */}

            <AppHeader
              title="Live Attendance"
              subtitle="Real-time employee monitoring"
              navigation={navigation}
              showBack
            />

            {/* STATS */}

            <View style={styles.statsRow}>

              <StatsCard
                title="Active"
                value="121"
                icon="people"
                colors={
                  COLORS.gradientSuccess
                }
              />

              <StatsCard
                title="Absent"
                value="07"
                icon="close-circle"
                colors={
                  COLORS.gradientDanger
                }
              />

            </View>

            <View style={styles.statsRow}>

              <StatsCard
                title="Late"
                value="04"
                icon="time"
                colors={
                  COLORS.gradientSky
                }
              />

              <StatsCard
                title="AI Alerts"
                value="01"
                icon="warning"
                colors={
                  COLORS.gradientPrimary
                }
              />

            </View>

            {/* AI STATUS */}

            <GlassCard gradient>

              <Text style={styles.whiteTitle}>
                AI Monitoring Status
              </Text>

              <MonitorRow
                icon="scan"
                text="Face verification active"
              />

              <MonitorRow
                icon="shield-checkmark"
                text="Anti-spoof protection enabled"
              />

              <MonitorRow
                icon="eye"
                text="Liveness detection running"
              />

              <MonitorRow
                icon="analytics"
                text="Real-time attendance sync active"
              />

            </GlassCard>

            {/* TITLE */}

            <Text style={styles.sectionTitle}>
              Live Attendance Feed
            </Text>

          </>
        }
      />

    </ScreenContainer>
  );
}

// =====================================
// MONITOR ROW
// =====================================

function MonitorRow({
  icon,
  text,
}) {

  return (

    <View style={styles.monitorRow}>

      <Ionicons
        name={icon}
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.monitorText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  statsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 12,
  },

  whiteTitle: {

    color: '#FFFFFF',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  sectionTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginTop: 10,

    marginBottom: 18,
  },

  monitorRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  monitorText: {

    color: '#FFFFFF',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

  topRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  userRow: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  avatar: {

    width: 56,

    height: 56,

    borderRadius: 18,

    backgroundColor:
      COLORS.primary,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 14,
  },

  name: {

    color: COLORS.textPrimary,

    fontSize: FONTS.base,

    fontWeight: '800',
  },

  time: {

    color: COLORS.textSecondary,

    marginTop: 5,
  },

  statusBadge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 18,
  },

  statusText: {

    color: '#FFFFFF',

    fontWeight: '700',

    fontSize: 12,
  },

  aiRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 22,
  },

  aiLeft: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  aiLabel: {

    color: COLORS.textSecondary,

    marginLeft: 10,

    fontSize: FONTS.base,
  },

  aiStatus: {

    fontWeight: '800',

    fontSize: FONTS.base,
  },
});