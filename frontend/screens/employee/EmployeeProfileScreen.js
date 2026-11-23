import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  useAuth,
} from '../../context/AuthContext';

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
  SHADOWS,
} from '../../constants/theme';

import {
  getMyProfile,
  getMyStats,
} from '../../services/employeeService';

export default function EmployeeProfileScreen({
  navigation,
}) {

  const { user } = useAuth();
  const [profile, setProfile] =
    useState(user);

  const [stats, setStats] = useState({
    attendance: 0,
    leaves: 0,
    lateDays: 0,
    projects: 0,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {

      // Load profile
      const profileResult =
        await getMyProfile();

      if (profileResult.success) {
        setProfile(profileResult.data);
      }

      // Load stats
      const statsResult =
        await getMyStats();

      if (statsResult.success) {
        const data = statsResult.data;
        
        setStats({
          attendance:
            data?.attendance?.percentage || 0,
          leaves:
            data?.leaves?.approved || 0,
          lateDays:
            data?.attendance?.late || 0,
          projects: 0,
        });
      }

    } catch (error) {
      console.log(
        'PROFILE ERROR:',
        error?.message
      );
    }
  };


  return (

    <ScreenContainer>

      <ScrollView

        showsVerticalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >

        {/* HEADER */}

        <AppHeader
          title="My Profile"
          subtitle="Employee information"
          navigation={navigation}
          showBack
        />

        {/* PROFILE HERO */}

        <LinearGradient

          colors={
            COLORS.gradientPrimary
          }

          style={styles.profileCard}
        >

          {/* AVATAR */}

          <View style={styles.avatarContainer}>

            <Ionicons
              name="person"
              size={70}
              color="#FFFFFF"
            />

          </View>

          {/* USER */}

          <Text style={styles.name}>
            {
              profile?.name ||
              user?.name ||
              'Employee'
            }
          </Text>

          <Text style={styles.email}>
            {
              profile?.email ||
              user?.email ||
              'employee@email.com'
            }
          </Text>

          {/* BADGES */}

          <View style={styles.badgeRow}>

            <View
              style={styles.roleBadge}
            >

              <Ionicons
                name="shield-checkmark"
                size={14}
                color="#FFFFFF"
              />

              <Text
                style={styles.roleText}
              >
                {
                  profile?.role ||
                  user?.role ||
                  'employee'
                }
              </Text>

            </View>

            <View
              style={styles.activeBadge}
            >

              <View
                style={
                  styles.activeDot
                }
              />

              <Text
                style={
                  styles.activeText
                }
              >
                Active
              </Text>

            </View>

          </View>

        </LinearGradient>

        {/* ANALYTICS */}

        <View style={styles.statsRow}>

          <StatsCard
            title="Attendance"
            value={`${stats.attendance}%`}
            icon="checkmark-circle"
            colors={COLORS.gradientSuccess}
          />

          <StatsCard
            title="Leaves"
            value={`${stats.leaves}`}
            icon="calendar"
            colors={COLORS.gradientDanger}
          />

        </View>

        <View style={styles.statsRow}>

          <StatsCard
            title="Late Days"
            value={`${stats.lateDays}`}
            icon="time"
            colors={COLORS.gradientPrimary}
          />

          <StatsCard
            title="Projects"
            value={`${stats.projects}`}
            icon="briefcase"
            colors={COLORS.gradientSky}
          />
        </View>

        {/* DETAILS */}

        <GlassCard>

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Employee Details
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
            >

              <Ionicons
                name="create-outline"
                size={22}
                color={COLORS.primary}
              />

            </TouchableOpacity>

          </View>

          <ProfileRow
            icon="id-card"
            label="Employee ID"
            value={
              profile?.employee_id ||
              user?.employee_id ||
              'EMP001'
            }
          />

          <ProfileRow
            icon="briefcase"
            label="Department"
            value={
              profile?.department ||
              user?.department ||
              'Not Assigned'
            }
          />

          <ProfileRow
            icon="person"
            label="Designation"
            value={
              profile?.designation ||
              user?.designation ||
              'Not Assigned'
            }
          />

          <ProfileRow
            icon="business"
            label="Company"
            value={
              profile?.company ||
              user?.company ||
              'Not Assigned'
            }
          />

          <ProfileRow
            icon="calendar"
            label="Joining Date"
            value={
              profile?.joining_date ||
              user?.joining_date ||
              'Not Assigned'
            }
          />

          <ProfileRow
            icon="mail"
            label="Work Email"
            value={
              profile?.email ||
              user?.email ||
              'Not Available'
            }
          />

        </GlassCard>

        {/* ACCOUNT STATUS */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Account Status
          </Text>

          <StatusRow
            icon="checkmark-circle"
            label="Attendance Access"
            status="Enabled"
            success
          />

          <StatusRow
            icon="scan"
            label="Face Verification"
            status="Active"
            success
          />

          <StatusRow
            icon="shield-checkmark"
            label="AI Security"
            status="Protected"
            success
          />

          <StatusRow
            icon="notifications"
            label="Notifications"
            status="Enabled"
            success
          />

        </GlassCard>

        {/* SECURITY */}

        <GlassCard gradient>

          <Text style={styles.securityTitle}>
            Enterprise Security
          </Text>

          <SecurityItem
            icon="shield-checkmark"
            text="AI Attendance Protection Active"
          />

          <SecurityItem
            icon="scan"
            text="Biometric Face Verification Enabled"
          />

          <SecurityItem
            icon="lock-closed"
            text="Secure Authentication Protected"
          />

          <SecurityItem
            icon="cloud-done"
            text="Cloud Attendance Synchronization Active"
          />

        </GlassCard>

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// PROFILE ROW
// =====================================

function ProfileRow({

  icon,
  label,
  value,

}) {

  return (

    <View style={styles.profileRow}>

      <View style={styles.profileLeft}>

        <View style={styles.iconBox}>

          <Ionicons
            name={icon}
            size={18}
            color="#FFFFFF"
          />

        </View>

        <Text style={styles.label}>
          {label}
        </Text>

      </View>

      <Text style={styles.value}>
        {value}
      </Text>

    </View>
  );
}

// =====================================
// STATUS ROW
// =====================================

function StatusRow({

  icon,
  label,
  status,
  success,

}) {

  return (

    <View style={styles.statusRow}>

      <View style={styles.statusLeft}>

        <Ionicons
          name={icon}
          size={22}
          color={
            success
              ? '#00D097'
              : '#FF4F6D'
          }
        />

        <Text style={styles.statusLabel}>
          {label}
        </Text>

      </View>

      <Text
        style={[

          styles.statusValue,

          {
            color:
              success
                ? '#00D097'
                : '#FF4F6D',
          },
        ]}
      >
        {status}
      </Text>

    </View>
  );
}

// =====================================
// SECURITY ITEM
// =====================================

function SecurityItem({

  icon,
  text,

}) {

  return (

    <View style={styles.securityRow}>

      <Ionicons
        name={icon}
        size={22}
        color="#00FFB2"
      />

      <Text style={styles.securityText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  profileCard: {

    borderRadius: RADIUS['2xl'],

    padding: SPACING.xl,

    alignItems: 'center',

    marginBottom: SPACING.xl,

    ...SHADOWS.lg,
  },

  avatarContainer: {

    width: 120,

    height: 120,

    borderRadius: 40,

    backgroundColor:
      'rgba(255,255,255,0.15)',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 20,
  },

  name: {

    color: '#FFFFFF',

    fontSize: 30,

    fontWeight: '800',
  },

  email: {

    color:
      'rgba(255,255,255,0.92)',

    marginTop: 6,

    fontSize: FONTS.sm,
  },

  badgeRow: {

    flexDirection: 'row',

    marginTop: 18,
  },

  roleBadge: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor:
      'rgba(255,255,255,0.18)',

    paddingHorizontal: 16,

    paddingVertical: 10,

    borderRadius: 20,

    marginRight: 10,
  },

  roleText: {

    color: '#FFFFFF',

    fontWeight: '700',

    textTransform: 'uppercase',

    fontSize: 12,

    marginLeft: 6,
  },

  activeBadge: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor:
      'rgba(0,255,178,0.16)',

    paddingHorizontal: 16,

    paddingVertical: 10,

    borderRadius: 20,
  },

  activeDot: {

    width: 10,

    height: 10,

    borderRadius: 10,

    backgroundColor: '#00FFB2',

    marginRight: 8,
  },

  activeText: {

    color: '#00FFB2',

    fontWeight: '700',
  },

  statsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  sectionHeader: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 20,
  },

  sectionTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',
  },

  profileRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 20,
  },

  profileLeft: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  iconBox: {

    width: 44,

    height: 44,

    borderRadius: 14,

    backgroundColor:
      COLORS.primary,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 14,
  },

  label: {

    color: COLORS.textSecondary,

    fontSize: FONTS.base,
  },

  value: {

    color: COLORS.textPrimary,

    fontWeight: '700',

    maxWidth: '45%',

    textAlign: 'right',
  },

  statusRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 20,
  },

  statusLeft: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  statusLabel: {

    color: COLORS.textPrimary,

    marginLeft: 12,

    fontSize: FONTS.base,
  },

  statusValue: {

    fontWeight: '700',
  },

  securityTitle: {

    color: '#FFFFFF',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  securityRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  securityText: {

    color: '#FFFFFF',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

});