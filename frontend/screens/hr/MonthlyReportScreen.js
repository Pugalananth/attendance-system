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
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  attendanceAPI,
} from '../../services/api';

import {
  getLeaveRequests,
  getMonthlyReport,
} from '../../services/hrService';

import {
  COLORS,
  SHADOWS,
} from '../../constants/theme';

export default function MonthlyReportScreen({
  navigation,
}) {

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [report, setReport] =
    useState({
      totalEmployees: 0,
      presentEmployees: 0,
      absentEmployees: 0,
      lateEmployees: 0,
      attendanceRate: 0,
      payrollAccuracy: 0,
      leaveRequests: 0,
      approvedLeaves: 0,
      workingDays: 0,
      departments: [],
    });

  const loadReports =
    useCallback(async () => {
      try {
        setLoading(true);

        const [
          reportResult,
          leavesResult,
        ] = await Promise.all([
          getMonthlyReport(),
          getLeaveRequests(),
        ]);

        const data =
          reportResult.data || {};

        const summary =
          data.summary || {};

        const leaves =
          leavesResult.leaves || [];

        const departmentMap = {};

        (data.employees || [])
          .forEach((employee) => {
            const dept =
              employee.department ||
              'General';

            if (!departmentMap[dept]) {
              departmentMap[dept] = {
                count: 0,
                percentage: 0,
              };
            }

            departmentMap[dept].count += 1;
            departmentMap[dept]
              .percentage +=
                employee.percentage || 0;
          });

        const departments =
          Object.keys(departmentMap)
            .map((name) => ({
              name,
              percentage: Math.round(
                departmentMap[name]
                  .percentage /
                departmentMap[name].count
              ),
            }));

        const attendanceRate =
          summary
            .avg_attendance_percentage ||
          data.attendance_rate ||
          0;

        setReport({
          totalEmployees:
            summary.total_employees || 0,
          presentEmployees:
            summary.present ||
            data.present ||
            0,
          absentEmployees:
            summary.absent ||
            data.absent ||
            0,
          lateEmployees:
            summary.late ||
            data.late ||
            0,
          attendanceRate,
          payrollAccuracy:
            attendanceRate >= 90
              ? 98
              : 90,
          leaveRequests:
            leaves.length,
          approvedLeaves:
            leaves.filter(
              (item) =>
                String(item.status)
                  .toLowerCase() ===
                'approved'
            ).length,
          workingDays:
            summary.working_days || 0,
          departments,
        });
      } catch (error) {
        console.log(
          'REPORT ERROR:',
          error
        );

        Alert.alert(
          'Error',
          'Failed to load reports'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
  };

  const exportReport = async () => {
    try {
      await attendanceAPI.exportCSV();

      Alert.alert(
        'Export Report',
        'Monthly report export requested'
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
        'Export failed'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
        <Text style={styles.loadingText}>
          Loading Reports...
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
              Enterprise Analytics
            </Text>
            <Text style={styles.title}>
              Monthly Reports
            </Text>
            <Text style={styles.subtitle}>
              HR and payroll analytics
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
                name="bar-chart"
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
                Attendance Performance
              </Text>
              <Text style={styles.heroSub}>
                Enterprise monthly analytics
              </Text>
            </View>
            <Ionicons
              name="analytics"
              size={52}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.heroStats}>
            <HeroStat
              value={`${report.attendanceRate}%`}
              label="Attendance"
            />
            <HeroStat
              value={report.presentEmployees}
              label="Present"
            />
            <HeroStat
              value={report.lateEmployees}
              label="Late"
            />
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          <SummaryCard
            title="Employees"
            value={report.totalEmployees}
            icon="people"
            color="#4F8EF7"
          />
          <SummaryCard
            title="Absent"
            value={report.absentEmployees}
            icon="close-circle"
            color="#FF4F6D"
          />
        </View>

        <View style={styles.statsRow}>
          <SummaryCard
            title="Working Days"
            value={report.workingDays}
            icon="calendar"
            color="#FFB547"
          />
          <SummaryCard
            title="Leaves"
            value={report.leaveRequests}
            icon="document-text"
            color="#00D097"
          />
        </View>

        <Section title="Department Performance" />

        {report.departments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No department analytics
            </Text>
          </View>
        ) : (
          report.departments.map(
            (item) => (
              <DepartmentRow
                key={item.name}
                name={item.name}
                percentage={
                  item.percentage
                }
              />
            )
          )
        )}

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={exportReport}
          activeOpacity={0.9}
        >
          <Ionicons
            name="download-outline"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.exportText}>
            Export Attendance CSV
          </Text>
        </TouchableOpacity>
      </ScrollView>
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

function SummaryCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <View style={styles.summaryCard}>
      <Ionicons
        name={icon}
        size={24}
        color={color}
      />
      <Text style={styles.summaryValue}>
        {value}
      </Text>
      <Text style={styles.summaryTitle}>
        {title}
      </Text>
    </View>
  );
}

function Section({
  title,
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function DepartmentRow({
  name,
  percentage,
}) {
  return (
    <View style={styles.departmentRow}>
      <View style={styles.departmentLeft}>
        <Ionicons
          name="business"
          size={18}
          color="#fff"
        />
        <Text style={styles.departmentName}>
          {name}
        </Text>
      </View>
      <Text style={styles.departmentPercentage}>
        {percentage}%
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

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  summaryCard: {
    width: '48%',
    backgroundColor: '#151D35',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E2A45',
  },

  summaryValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
  },

  summaryTitle: {
    color: COLORS.textSecondary,
    marginTop: 6,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 18,
  },

  emptyCard: {
    backgroundColor: '#151D35',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },

  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  departmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#151D35',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E2A45',
  },

  departmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  departmentName: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '700',
  },

  departmentPercentage: {
    color: '#00FFB2',
    fontWeight: '800',
  },

  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 10,
  },

  exportText: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginLeft: 10,
  },
});
