import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../services/employeeService';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import AppHeader from '../../components/ui/AppHeader';
import InputField from '../../components/InputField';
import GradientButton from '../../components/GradientButton';

export default function AdminProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      if (res.success) {
        setProfile(res.data);
        setForm({
          name: res.data.name || '',
          phone: res.data.phone || '',
          email: res.data.email || '',
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      const res = await updateMyProfile(form);
      if (res.success) {
        setProfile({...profile, ...form});
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (e) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppHeader title="Admin Profile" showBack navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.nameText}>{profile?.name}</Text>
          <Text style={styles.roleText}>System Administrator</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons name={isEditing ? "close-circle" : "create-outline"} size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View>
              <InputField label="Full Name" value={form.name} onChangeText={(v) => setForm({...form, name: v})} />
              <InputField label="Email (View Only)" value={form.email} editable={false} />
              <InputField label="Phone" value={form.phone} onChangeText={(v) => setForm({...form, phone: v})} keyboardType="phone-pad" />
              <GradientButton title="Save Changes" onPress={handleUpdate} loading={submitting} />
            </View>
          ) : (
            <View>
              <DetailItem label="Employee ID" value={profile?.employee_id} icon="id-card-outline" />
              <DetailItem label="Work Email" value={profile?.email} icon="mail-outline" />
              <DetailItem label="Phone" value={profile?.phone || 'Not provided'} icon="call-outline" />
              <DetailItem label="Department" value={profile?.department || 'Administration'} icon="business-outline" />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sign Out from System</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const DetailItem = ({ label, value, icon }) => (
  <View style={styles.detailItem}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={18} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1, marginLeft: 15 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16 },
  heroCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center', marginBottom: 20, ...SHADOWS.sm },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary + '10', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  nameText: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  roleText: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginTop: 4 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20, ...SHADOWS.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary + '10', justifyContent: 'center', alignItems: 'center' },
  detailLabel: { fontSize: 11, color: COLORS.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: COLORS.danger + '30', marginTop: 10, marginBottom: 40 },
  logoutText: { color: COLORS.danger, fontWeight: '700', marginLeft: 10 },
});
