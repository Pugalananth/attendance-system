import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRequestHistory } from '../../services/adminService';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../../constants/theme';
import AppHeader from '../../components/ui/AppHeader';

export default function AdminRequestHistoryScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Pending, Approved, Rejected

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRequestHistory();
      if (res.success) {
        setRequests(res.data || []);
        setFiltered(res.data || []);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    let list = [...requests];

    // Status Filter
    if (statusFilter !== 'All') {
      list = list.filter(r => String(r.status).toLowerCase() === statusFilter.toLowerCase());
    }

    // Search
    if (search) {
      const query = search.toLowerCase();
      list = list.filter(r =>
        (r.employee_name || '').toLowerCase().includes(query) ||
        (r.employee_id || '').toLowerCase().includes(query)
      );
    }

    setFiltered(list);
  }, [search, statusFilter, requests]);

  if (loading && !refreshing) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Request History" showBack navigation={navigation} />

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Search name or ID..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, statusFilter === f && styles.filterBtnActive]}
            onPress={() => setStatusFilter(f)}
          >
            <Text style={[styles.filterText, statusFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item._id || index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadHistory} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="list-outline" size={60} color={COLORS.textDisabled} />
            <Text style={styles.emptyText}>No requests found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.empName}>{item.employee_name || 'Staff'}</Text>
                <Text style={styles.empId}>{item.employee_id} • {item.request_type?.toUpperCase()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.dateText}>{item.start_date || item.date || 'N/A'}</Text>
              <Text style={styles.reasonText} numberOfLines={2}>{item.reason || 'No reason provided'}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerLabel}>Processed By:</Text>
              <Text style={styles.footerVal}>{item.approved_by || item.rejected_by || 'Pending'}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const getStatusColor = (s) => {
  const status = String(s).toLowerCase();
  if (status === 'approved') return COLORS.success;
  if (status === 'rejected') return COLORS.danger;
  return COLORS.warning;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', height: 48, borderRadius: 10, paddingHorizontal: 15, ...SHADOWS.sm },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 15 },
  filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE' },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },
  filterTextActive: { color: '#FFF' },
  list: { padding: 16, paddingBottom: 40 },
  requestCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 16, marginBottom: 15, ...SHADOWS.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  empName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  empId: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  cardBody: { borderBottomWidth: 1, borderBottomColor: '#F8F8F8', paddingBottom: 12, marginBottom: 12 },
  dateText: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginBottom: 5 },
  reasonText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  footerLabel: { fontSize: 11, color: COLORS.textMuted },
  footerVal: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginLeft: 5 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textSecondary, marginTop: 15 },
});
