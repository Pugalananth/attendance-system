import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import ScreenContainer from
'../../components/ui/ScreenContainer';

import AppHeader from
'../../components/ui/AppHeader';

import GlassCard from
'../../components/ui/GlassCard';

import PrimaryButton from
'../../components/ui/PrimaryButton';

import {

  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

export default function CompanySettingsScreen({
  navigation,
}) {

  // =====================================
  // STATES
  // =====================================

  const [aiSecurity,
    setAiSecurity] =
      useState(true);

  const [notifications,
    setNotifications] =
      useState(true);

  const [liveness,
    setLiveness] =
      useState(true);

  const [remoteAttendance,
    setRemoteAttendance] =
      useState(true);

  const [companyName,
    setCompanyName] =
      useState('FaceAttend AI');

  const [officeTime,
    setOfficeTime] =
      useState(
        '09:00 AM - 06:00 PM'
      );

  const [lateEntry,
    setLateEntry] =
      useState('15 Minutes');

  // =====================================
  // SAVE
  // =====================================

  const saveSettings =
    () => {

    Alert.alert(

      'Settings Saved',

      'Enterprise company settings updated successfully.'
    );
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
          title="Company Settings"
          subtitle="Enterprise configuration center"
          navigation={navigation}
          showBack
        />

        {/* HERO */}

        <LinearGradient

          colors={
            COLORS.gradientPrimary
          }

          style={styles.heroCard}
        >

          <View style={styles.heroTop}>

            <View>

              <Text style={styles.heroTitle}>
                Enterprise Controls
              </Text>

              <Text style={styles.heroSub}>
                AI attendance configuration
              </Text>

            </View>

            <Ionicons
              name="settings"
              size={50}
              color="#FFFFFF"
            />

          </View>

          <View style={styles.heroStats}>

            <HeroStat
              value="24/7"
              label="Monitoring"
            />

            <HeroStat
              value="AI"
              label="Security"
            />

            <HeroStat
              value="99%"
              label="Uptime"
            />

          </View>

        </LinearGradient>

        {/* COMPANY INFO */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Company Information
          </Text>

          <Text style={styles.label}>
            Company Name
          </Text>

          <TextInput
            value={companyName}
            onChangeText={
              setCompanyName
            }
            style={styles.input}
            placeholder="Company Name"
            placeholderTextColor={
              COLORS.textMuted
            }
          />

          <Text style={styles.label}>
            Office Timings
          </Text>

          <TextInput
            value={officeTime}
            onChangeText={
              setOfficeTime
            }
            style={styles.input}
            placeholder="Office Timing"
            placeholderTextColor={
              COLORS.textMuted
            }
          />

          <Text style={styles.label}>
            Late Entry Policy
          </Text>

          <TextInput
            value={lateEntry}
            onChangeText={
              setLateEntry
            }
            style={styles.input}
            placeholder="Late Entry"
            placeholderTextColor={
              COLORS.textMuted
            }
          />

        </GlassCard>

        {/* AI SETTINGS */}

        <GlassCard gradient>

          <Text style={styles.whiteTitle}>
            AI Security Settings
          </Text>

          <SettingRow
            icon="shield-checkmark"
            title="AI Face Security"
            subtitle="Advanced biometric protection"
            value={aiSecurity}
            onChange={setAiSecurity}
          />

          <SettingRow
            icon="eye"
            title="Liveness Detection"
            subtitle="Anti-spoof verification"
            value={liveness}
            onChange={setLiveness}
          />

          <SettingRow
            icon="notifications"
            title="Push Notifications"
            subtitle="Enterprise alert system"
            value={notifications}
            onChange={
              setNotifications
            }
          />

          <SettingRow
            icon="home"
            title="Remote Attendance"
            subtitle="WFH attendance access"
            value={remoteAttendance}
            onChange={
              setRemoteAttendance
            }
          />

        </GlassCard>

        {/* ATTENDANCE POLICY */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Attendance Policy
          </Text>

          <PolicyRow
            icon="time"
            text="Late entry allowed for 15 minutes"
          />

          <PolicyRow
            icon="scan"
            text="Face verification mandatory"
          />

          <PolicyRow
            icon="shield-checkmark"
            text="AI anti-spoof protection active"
          />

          <PolicyRow
            icon="calendar"
            text="Remote attendance enabled"
          />

          <PolicyRow
            icon="business"
            text="Department approval required for exceptions"
          />

        </GlassCard>

        {/* SYSTEM STATUS */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            System Status
          </Text>

          <StatusRow
            label="Backend API"
            status="Online"
            success
          />

          <StatusRow
            label="MongoDB"
            status="Connected"
            success
          />

          <StatusRow
            label="AI Engine"
            status="Running"
            success
          />

          <StatusRow
            label="Cloud Backup"
            status="Active"
            success
          />

        </GlassCard>

        {/* SECURITY */}

        <GlassCard gradient>

          <Text style={styles.whiteTitle}>
            Enterprise Security
          </Text>

          <SecurityRow
            text="AI attendance monitoring enabled"
          />

          <SecurityRow
            text="Encrypted attendance records"
          />

          <SecurityRow
            text="Biometric verification secured"
          />

          <SecurityRow
            text="Enterprise cloud synchronization active"
          />

        </GlassCard>

        {/* SAVE */}

        <PrimaryButton
          title="Save Company Settings"
          onPress={saveSettings}
          style={{
            marginTop: 10,
          }}
        />

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// HERO STAT
// =====================================

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

// =====================================
// SETTING ROW
// =====================================

function SettingRow({

  icon,
  title,
  subtitle,
  value,
  onChange,

}) {

  return (

    <View style={styles.settingRow}>

      <View style={styles.settingLeft}>

        <Ionicons
          name={icon}
          size={24}
          color="#FFFFFF"
        />

        <View
          style={{
            marginLeft: 14,
          }}
        >

          <Text style={styles.settingText}>
            {title}
          </Text>

          <Text
            style={styles.settingSub}
          >
            {subtitle}
          </Text>

        </View>

      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor="#FFFFFF"
        trackColor={{
          false: '#666',
          true: '#00D097',
        }}
      />

    </View>
  );
}

// =====================================
// POLICY ROW
// =====================================

function PolicyRow({

  icon,
  text,

}) {

  return (

    <View style={styles.policyRow}>

      <Ionicons
        name={icon}
        size={20}
        color={COLORS.primary}
      />

      <Text style={styles.policyText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// STATUS ROW
// =====================================

function StatusRow({

  label,
  status,
  success,

}) {

  return (

    <View style={styles.statusRow}>

      <Text style={styles.statusLabel}>
        {label}
      </Text>

      <View
        style={[

          styles.statusBadge,

          success && {
            backgroundColor:
              COLORS.success,
          },
        ]}
      >

        <Text style={styles.statusText}>
          {status}
        </Text>

      </View>

    </View>
  );
}

// =====================================
// SECURITY ROW
// =====================================

function SecurityRow({
  text,
}) {

  return (

    <View style={styles.securityRow}>

      <Ionicons
        name="shield-checkmark"
        size={20}
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

  heroCard: {

    borderRadius: RADIUS['2xl'],

    padding: SPACING.xl,

    marginBottom: SPACING.xl,

    ...SHADOWS.primary,
  },

  heroTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 28,
  },

  heroTitle: {

    color: '#FFFFFF',

    fontSize: 24,

    fontWeight: '800',
  },

  heroSub: {

    color:
      'rgba(255,255,255,0.88)',

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

    color:
      'rgba(255,255,255,0.82)',

    marginTop: 6,
  },

  sectionTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  whiteTitle: {

    color: '#FFFFFF',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  label: {

    color: COLORS.textPrimary,

    marginBottom: 10,

    marginTop: 10,

    fontWeight: '700',

    fontSize: FONTS.base,
  },

  input: {

    backgroundColor:
      COLORS.bgElevated,

    borderRadius: RADIUS.lg,

    paddingHorizontal: 16,

    paddingVertical: 16,

    color: COLORS.textPrimary,

    borderWidth: 1,

    borderColor: COLORS.border,

    marginBottom: 14,

    fontSize: FONTS.base,
  },

  settingRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 24,
  },

  settingLeft: {

    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  settingText: {

    color: '#FFFFFF',

    fontSize: FONTS.base,

    fontWeight: '700',
  },

  settingSub: {

    color:
      'rgba(255,255,255,0.78)',

    marginTop: 4,

    fontSize: 12,
  },

  policyRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  policyText: {

    color: COLORS.textSecondary,

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

  statusRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  statusLabel: {

    color: COLORS.textSecondary,

    fontSize: FONTS.base,
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