import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { permissionAPI } from '../../services/api';
import { COLORS, SHADOWS, SPACING } from '../../constants/theme';
import AppHeader from '../../components/ui/AppHeader';

export default function PermissionHistoryScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await permissionAPI.getHistoryHR({
        search: search,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      if (res.data.success) {
        setRequests(res.data.permissions || []);
      }
    } catch (e) {
      console.log('Load Permission History Error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  const getStatusColor = (s) => {
    const status = String(s).toLowerCase();
    if (status === 'approved') return COLORS.success;
    if (status === 'rejected') return COLORS.danger;
    return COLORS.warning;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Permission History" showBack navigation={navigation} />

      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Search by name or ID..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.tabBar}>
          {['all', 'approved', 'rejected', 'pending'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, statusFilter === tab && styles.activeTab]}
              onPress={() => setStatusFilter(tab)}
            >
              <Text style={[styles.tabText, statusFilter === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={requests}
        keyExtractor={item => item.id || item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color={COLORS.textDisabled} />
            <Text style={styles.empty}>No matching permission records found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.empName}>{item.name}</Text>
                <Text style={styles.empId}>{item.employee_id} • {item.date}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.details}>
              <Text style={styles.info}><Ionicons name="list" size={14} /> {item.permission_type}</Text>
              <Text style={styles.info}><Ionicons name="time-outline" size={14} /> {item.start_time} - {item.end_time}</Text>
              <Text style={styles.reason}>"{item.reason}"</Text>
              {item.remarks && (
                <View style={styles.remarksBox}>
                  <Text style={styles.remarksLabel}>HR Remarks:</Text>
                  <Text style={styles.remarksText}>{item.remarks}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  filterSection: { backgroundColor: '#FFF', paddingBottom: 10, ...SHADOWS.sm },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', margin: 16, paddingHorizontal: 16, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.textPrimary },
  tabBar: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#F0F2F5' },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  activeTabText: { color: '#FFF' },
  list: { padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, ...SHADOWS.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  empName: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  empId: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  details: { gap: 6 },
  info: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '600' },
  reason: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 4 },
  remarksBox: { marginTop: 12, padding: 10, backgroundColor: '#FFF8E1', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: COLORS.warning },
  remarksLabel: { fontSize: 11, fontWeight: '800', color: COLORS.warningDark, marginBottom: 2 },
  remarksText: { fontSize: 12, color: COLORS.textPrimary },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  empty: { textAlign: 'center', marginTop: 15, color: COLORS.textSecondary, fontSize: 14 },
});
