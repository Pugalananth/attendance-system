import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
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

import PrimaryButton from
'../../components/ui/PrimaryButton';

import {

  COLORS,
  FONTS,

} from '../../constants/theme';

// import api from '../../services/api';

export default function TeamReportScreen({
  navigation,
}) {

  // =====================================
  // STATES
  // =====================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [report,
    setReport] =
      useState({

        tasksDone: 0,

        pending: 0,

        attendance: 0,

        efficiency: 0,

        summary: {},

        insights: [],

        tasks: [],
      });

  // =====================================
  // LOAD REPORT
  // =====================================

  const loadReport =
    async () => {

    try {

      setLoading(true);

      // ===============================
      // BACKEND API
      // ===============================

      /*
      const response =
        await api.get(
          '/team/reports'
        );

      setReport(
        response.data
      );
      */

      // ===============================
      // MOCK DATA
      // ===============================

      setTimeout(() => {

        setReport({

          tasksDone: 42,

          pending: 8,

          attendance: 95,

          efficiency: 92,

          summary: {

            present: 16,

            absent: 1,

            late: 1,

            hours:
              '08h 24m',
          },

          insights: [

            'Development team achieved 96% completion',

            'Attendance improved by 10% this week',

            'Late entries reduced significantly',

            'AI attendance monitoring active',

          ],

          tasks: [

            {
              task:
                'Mobile App UI',
              status:
                'Completed',
            },

            {
              task:
                'Backend API',
              status:
                'In Progress',
            },

            {
              task:
                'AI Integration',
              status:
                'Completed',
            },

            {
              task:
                'Testing Phase',
              status:
                'Pending',
            },

          ],
        });

        setLoading(false);

      }, 1200);

    } catch (error) {

      console.log(error);

      setLoading(false);

      Alert.alert(
        'Error',
        'Failed to load reports'
      );
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadReport();

    setRefreshing(false);
  };

  // =====================================
  // EXPORT REPORT
  // =====================================

  const exportReport =
    () => {

    Alert.alert(
      'Export Started',
      'Team report export initialized'
    );

    /*
    await api.post(
      '/team/reports/export'
    );
    */
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadReport();

  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <ScreenContainer>

        <View style={styles.loader}>

          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.loadingText}>
            Loading reports...
          </Text>

        </View>

      </ScreenContainer>
    );
  }

  return (

    <ScreenContainer>

      {/* HEADER */}

      <AppHeader
        title="Team Reports"
        subtitle="Enterprise reporting center"
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

            tintColor={
              COLORS.primary
            }
          />
        }
      >

        {/* STATS */}

        <View style={styles.statsRow}>

          <StatsCard
            title="Tasks Done"
            value={report.tasksDone}
            icon="checkmark-done"
            colors={COLORS.gradientSuccess}
          />

          <StatsCard
            title="Pending"
            value={report.pending}
            icon="time"
            colors={COLORS.gradientDanger}
          />

        </View>

        <View style={styles.statsRow}>

          <StatsCard
            title="Attendance"
            value={`${report.attendance}%`}
            icon="analytics"
            colors={COLORS.gradientPrimary}
          />

          <StatsCard
            title="Efficiency"
            value={`${report.efficiency}%`}
            icon="trending-up"
            colors={COLORS.gradientSky}
          />

        </View>

        {/* SUMMARY */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Daily Summary
          </Text>

          <SummaryRow
            label="Present Employees"
            value={
              report.summary.present
            }
          />

          <SummaryRow
            label="Absent Employees"
            value={
              report.summary.absent
            }
          />

          <SummaryRow
            label="Late Entries"
            value={
              report.summary.late
            }
          />

          <SummaryRow
            label="Average Working Hours"
            value={
              report.summary.hours
            }
          />

        </GlassCard>

        {/* INSIGHTS */}

        <GlassCard gradient>

          <Text style={styles.whiteTitle}>
            Productivity Insights
          </Text>

          {

            report.insights.map(
              (item, index) => (

              <InsightRow
                key={index}
                text={item}
              />
            ))
          }

        </GlassCard>

        {/* TASKS */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Team Task Status
          </Text>

          {

            report.tasks.map(
              (item, index) => (

              <TaskRow
                key={index}
                task={item.task}
                status={item.status}
              />
            ))
          }

        </GlassCard>

        {/* EXPORT */}

        <PrimaryButton
          title="Export Team Report"
          onPress={exportReport}
          style={{
            marginTop: 10,
          }}
        />

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// SUMMARY ROW
// =====================================

function SummaryRow({

  label,
  value,

}) {

  return (

    <View style={styles.summaryRow}>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>

      <Text style={styles.summaryValue}>
        {value}
      </Text>

    </View>
  );
}

// =====================================
// INSIGHT ROW
// =====================================

function InsightRow({
  text,
}) {

  return (

    <View style={styles.insightRow}>

      <Ionicons
        name="analytics"
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.insightText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// TASK ROW
// =====================================

function TaskRow({

  task,
  status,

}) {

  const statusColor =

    status === 'Completed'

      ? COLORS.success

      : status === 'In Progress'

      ? COLORS.warning

      : COLORS.error;

  return (

    <View style={styles.taskRow}>

      <Text style={styles.taskText}>
        {task}
      </Text>

      <View
        style={[
          styles.taskBadge,
          {
            backgroundColor:
              statusColor,
          },
        ]}
      >

        <Text style={styles.taskStatus}>
          {status}
        </Text>

      </View>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  loader: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  loadingText: {

    color: COLORS.textPrimary,

    marginTop: 14,

    fontSize: 16,
  },

  statsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  sectionTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  whiteTitle: {

    color: '#fff',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  summaryRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 18,
  },

  summaryLabel: {

    color: COLORS.textSecondary,

    fontSize: FONTS.base,
  },

  summaryValue: {

    color: COLORS.textPrimary,

    fontWeight: '800',

    fontSize: FONTS.base,
  },

  insightRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  insightText: {

    color: '#fff',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

  taskRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  taskText: {

    color: COLORS.textPrimary,

    fontSize: FONTS.base,

    fontWeight: '700',
  },

  taskBadge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 18,
  },

  taskStatus: {

    color: '#fff',

    fontWeight: '700',

    fontSize: 12,
  },

});