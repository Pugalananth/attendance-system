/**
 * AttendanceReportScreen - Monthly analytics and per-student breakdown
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { attendanceAPI } from '../../services/api';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { format, subMonths, addMonths } from 'date-fns';

export default function AttendanceReportScreen({ navigation }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthKey = format(currentMonth, 'yyyy-MM');

  const fetchReport = useCallback(async () => {
    try {
      const res = await attendanceAPI.getReport({ month: monthKey });
      if (res.data.success) setReport(res.data.data);
    } catch (e) {
      console.warn('Report fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [monthKey]);

  useEffect(() => { setLoading(true); fetchReport(); }, [monthKey]);

  const sortedStudents = report?.students?.slice().sort((a, b) => b.percentage - a.percentage) || [];

  const getColor = (pct) => {
    if (pct >= 75) return COLORS.success;
    if (pct >= 50) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A1A', '#0D0D20', '#0A0A1A']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReport(); }} tintColor={COLORS.primary} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Attendance Report</Text>
            <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export', 'CSV export triggered for ' + monthKey)}>
              <Ionicons name="download-outline" size={18} color={COLORS.success} />
            </TouchableOpacity>
          </View>

          {/* Month Nav */}
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.monthArrow} onPress={() => setCurrentMonth(d => subMonths(d, 1))}>
              <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
            <TouchableOpacity
              style={styles.monthArrow}
              onPress={() => setCurrentMonth(d => addMonths(d, 1))}
              disabled={format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')}
            >
              <Ionicons name="chevron-forward" size={20} color={format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM') ? COLORS.textMuted : COLORS.primary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Generating report...</Text>
            </View>
          ) : !report ? (
            <View style={styles.empty}>
              <Ionicons name="bar-chart-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          ) : (
            <>
              {/* Summary Cards */}
              <View style={styles.summaryGrid}>
                <SummaryItem label="Total Students" value={report.summary.total_students} icon="people" color={COLORS.primary} />
                <SummaryItem label="Working Days" value={report.summary.working_days} icon="calendar" color={COLORS.secondary} />
                <SummaryItem label="Avg Attendance" value={`${report.summary.avg_attendance_percentage}%`} icon="trending-up" color={COLORS.success} />
                <SummaryItem label="Total Records" value={report.summary.total_records} icon="list" color={COLORS.warning} />
              </View>

              {/* Daily Breakdown Chart */}
              {report.daily_breakdown?.length > 0 && (
                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>Daily Attendance</Text>
                  <View style={styles.chart}>
                    {report.daily_breakdown.slice(-14).map((day, i) => {
                      const maxCount = Math.max(...report.daily_breakdown.map(d => d.count), 1);
                      const h = (day.count / maxCount) * 70;
                      return (
                        <View key={i} style={styles.bar}>
                          <Text style={styles.barCount}>{day.count}</Text>
                          <View style={styles.barBg}>
                            <LinearGradient
                              colors={COLORS.gradientPrimary}
                              style={[styles.barFill, { height: Math.max(h, 2) }]}
                            />
                          </View>
                          <Text style={styles.barDate}>{format(new Date(day.date), 'd')}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Per-student Report */}
              <Text style={styles.sectionTitle}>Student Breakdown</Text>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.success }]} /><Text style={styles.legendText}>≥75% Good</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} /><Text style={styles.legendText}>50-74% Avg</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: COLORS.error }]} /><Text style={styles.legendText}>{'<'}50% Low</Text></View>
              </View>

              {sortedStudents.map((s) => (
                <View key={s.student_id} style={styles.studentRow}>
                  <View style={styles.studentRowLeft}>
                    <View style={[styles.rankDot, { backgroundColor: getColor(s.percentage) }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sName} numberOfLines={1}>{s.name}</Text>
                      <Text style={styles.sMeta}>{s.student_id} · {s.department || 'N/A'}</Text>
                    </View>
                  </View>
                  <View style={styles.studentRowRight}>
                    <View style={styles.pctBarBg}>
                      <View style={[styles.pctBarFill, { width: `${s.percentage}%`, backgroundColor: getColor(s.percentage) }]} />
                    </View>
                    <Text style={[styles.pctText, { color: getColor(s.percentage) }]}>
                      {s.percentage}%
                    </Text>
                    <Text style={styles.daysText}>{s.present_days}d</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryItem({ label, value, icon, color }) {
  return (
    <View style={styles.summaryBox}>
      <View style={[styles.summaryIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.base, paddingBottom: SPACING['3xl'] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  headerTitle: { color: COLORS.textPrimary, fontSize: FONTS.md, fontWeight: '700' },
  exportBtn: { width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.successGlow, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,200,150,0.3)' },

  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
  monthArrow: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.primaryGlow, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderAccent },
  monthTitle: { color: COLORS.textPrimary, fontSize: FONTS.lg, fontWeight: '700' },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  summaryBox: { width: '47.5%', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  summaryIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  summaryValue: { fontSize: FONTS.xl, fontWeight: '800' },
  summaryLabel: { color: COLORS.textMuted, fontSize: FONTS.xs, marginTop: 2 },

  chartCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  chartTitle: { color: COLORS.textSecondary, fontSize: FONTS.sm, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.md },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  bar: { flex: 1, alignItems: 'center' },
  barCount: { color: COLORS.textMuted, fontSize: 9, fontWeight: '600', marginBottom: 2 },
  barBg: { width: 16, height: 70, backgroundColor: COLORS.bgElevated, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 4 },
  barDate: { color: COLORS.textMuted, fontSize: 9, fontWeight: '600', marginTop: 4 },

  sectionTitle: { color: COLORS.textPrimary, fontSize: FONTS.base, fontWeight: '700', marginBottom: SPACING.sm },
  legendRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: COLORS.textMuted, fontSize: FONTS.xs },

  studentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  studentRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: SPACING.sm },
  rankDot: { width: 10, height: 10, borderRadius: 5 },
  sName: { color: COLORS.textPrimary, fontSize: FONTS.sm, fontWeight: '600' },
  sMeta: { color: COLORS.textMuted, fontSize: FONTS.xs },
  studentRowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pctBarBg: { width: 60, height: 6, backgroundColor: COLORS.bgElevated, borderRadius: 3, overflow: 'hidden' },
  pctBarFill: { height: '100%', borderRadius: 3 },
  pctText: { fontSize: FONTS.xs, fontWeight: '800', minWidth: 36 },
  daysText: { color: COLORS.textMuted, fontSize: FONTS.xs },

  loadingWrap: { alignItems: 'center', paddingTop: SPACING['4xl'] },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.base },
  empty: { alignItems: 'center', paddingTop: SPACING['4xl'] },
  emptyText: { color: COLORS.textMuted, fontSize: FONTS.base, marginTop: SPACING.md },
});
