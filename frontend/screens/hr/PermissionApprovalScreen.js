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

export default function PermissionApprovalScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remarks, setRemarks] = useState({});

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await permissionAPI.getPending();
      if (res.data.success || Array.isArray(res.data.permissions)) {
        setRequests(res.data.permissions || res.data.data || []);
      }
    } catch (e) {
      console.log('Load Permissions Error:', e);
      Alert.alert('Error', 'Failed to load pending permission requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (id, action) => {
    try {
      const remarkText = remarks[id] || '';
      const res = action === 'approve'
        ? await permissionAPI.approve(id, { remarks: remarkText })
        : await permissionAPI.reject(id, { remarks: remarkText });

      if (res.data.success) {
        Alert.alert('Success', `Permission request ${action}d`);
        loadRequests();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to process request');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Permission Approvals" showBack navigation={navigation} />

      <FlatList
        data={requests}
        keyExtractor={item => item.id || item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRequests} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={60} color={COLORS.textDisabled} />
            <Text style={styles.empty}>No pending permission requests</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.empName}>{item.name || 'Staff Member'}</Text>
                <Text style={styles.empId}>{item.employee_id}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.infoRow}>
                <Ionicons name="list-outline" size={16} color={COLORS.primary} />
                <Text style={styles.label}>Type: <Text style={styles.val}>{item.permission_type}</Text></Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                <Text style={styles.label}>Timing: <Text style={styles.val}>{item.start_time} to {item.end_time}</Text></Text>
              </View>
              <Text style={styles.reasonLabel}>Reason:</Text>
              <Text style={styles.reason}>{item.reason}</Text>
            </View>

            <View style={styles.actionContainer}>
              <TextInput
                placeholder="Add remarks (optional)..."
                style={styles.remarkInput}
                value={remarks[item.id || item._id] || ''}
                onChangeText={(text) => setRemarks({...remarks, [item.id || item._id]: text})}
              />
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.approveBtn]}
                  onPress={() => handleAction(item.id || item._id, 'approve')}
                >
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.rejectBtn]}
                  onPress={() => handleAction(item.id || item._id, 'reject')}
                >
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const getStatusColor = (s) => {
  if (s === 'approved') return COLORS.success;
  if (s === 'rejected') return COLORS.danger;
  return COLORS.warning;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 18, marginBottom: 15, ...SHADOWS.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  empName: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  empId: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  details: { marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  label: { fontSize: 13, color: COLORS.textSecondary },
  val: { fontWeight: '700', color: COLORS.textPrimary },
  reasonLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginTop: 10, marginBottom: 4 },
  reason: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 18, padding: 10, backgroundColor: '#F8F9FA', borderRadius: 8, fontStyle: 'italic' },
  actionContainer: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15 },
  remarkInput: { backgroundColor: '#F9F9F9', height: 44, borderRadius: 10, paddingHorizontal: 12, marginBottom: 12, fontSize: 13, borderWidth: 1, borderColor: '#EEE' },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', ...SHADOWS.sm },
  approveBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.danger },
  btnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  empty: { textAlign: 'center', marginTop: 15, color: COLORS.textSecondary, fontSize: 15, fontWeight: '600' },
});
