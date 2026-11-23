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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { teamAPI, permissionAPI } from '../../services/api';
import { COLORS, SHADOWS, SPACING } from '../../constants/theme';
import AppHeader from '../../components/ui/AppHeader';

export default function TeamPermissionApprovalScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remarks, setRemarks] = useState({});

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await teamAPI.getPermissionRequests();
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load team permission requests');
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
      // Assuming permissionAPI has approve/reject or reusing leave logic if applicable
      // For now, using placeholders if permissionAPI.approvePermission doesn't exist
      const res = action === 'approve'
        ? await teamAPI.updatePermission(id, { status: 'approved', remarks: remarkText })
        : await teamAPI.updatePermission(id, { status: 'rejected', remarks: remarkText });

      if (res.data.success) {
        Alert.alert('Success', `Permission ${action}d`);
        loadRequests();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to process request');
    }
  };

  if (loading && !refreshing) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Short Leave Approvals" showBack navigation={navigation} />

      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRequests} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No pending short leave requests</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.empName}>{item.employee_name || 'Staff'}</Text>
              <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.details}>
              <Text style={styles.label}>Category: <Text style={styles.val}>{item.permission_type}</Text></Text>
              <Text style={styles.label}>Timing: <Text style={styles.val}>{item.start_time} to {item.end_time}</Text></Text>
              <Text style={styles.reason}>{item.reason}</Text>
            </View>

            {item.status === 'pending' && (
              <View style={styles.actionContainer}>
                <TextInput
                  placeholder="Add remarks..."
                  style={styles.remarkInput}
                  value={remarks[item._id] || ''}
                  onChangeText={(text) => setRemarks({...remarks, [item._id]: text})}
                />
                <View style={styles.btnRow}>
                  <TouchableOpacity style={[styles.btn, styles.approveBtn]} onPress={() => handleAction(item._id, 'approve')}>
                    <Text style={styles.btnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={() => handleAction(item._id, 'reject')}>
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 15, ...SHADOWS.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  empName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  details: { marginBottom: 15 },
  label: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  val: { fontWeight: '700', color: COLORS.textPrimary },
  reason: { fontSize: 13, color: COLORS.textSecondary, marginTop: 8, fontStyle: 'italic' },
  actionContainer: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15 },
  remarkInput: { backgroundColor: '#F9F9F9', height: 40, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12, fontSize: 13 },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  approveBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.danger },
  btnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 50, color: COLORS.textSecondary },
});
