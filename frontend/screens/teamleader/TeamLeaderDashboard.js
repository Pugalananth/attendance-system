import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  useAuth,
} from '../../context/AuthContext';

import {

  COLORS,
  FONTS,
  SHADOWS,

} from '../../constants/theme';

// import api from '../../services/api';

export default function TeamLeaderDashboard({
  navigation,
}) {

  const { logout } = useAuth();

  // =====================================
  // STATES
  // =====================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [dashboard,
    setDashboard] =
      useState({

        employees: 24,

        attendance: 96,

        performance: 92,

        present: 22,

        absent: 2,

        late: 3,

        wfh: 5,

        aiAccuracy: '99.2%',

        activities: [],
      });

  // =====================================
  // LOAD DASHBOARD
  // =====================================

  const loadDashboard =
    async () => {

    try {

      setLoading(true);

      /*
      const response =
        await api.get(
          '/team/dashboard'
        );

      setDashboard(
        response.data
      );
      */

      setTimeout(() => {

        setDashboard({

          employees: 24,

          attendance: 96,

          performance: 92,

          present: 22,

          absent: 2,

          late: 3,

          wfh: 5,

          aiAccuracy: '99.2%',

          activities: [

            'AI attendance monitoring active',

            'Attendance improved by 7%',

            'Face verification running',

            '2 employees marked late today',

          ],
        });

        setLoading(false);

      }, 1000);

    } catch (error) {

      setLoading(false);

      Alert.alert(
        'Error',
        'Failed to load dashboard'
      );
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadDashboard();

  }, []);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout =
    () => {

    Alert.alert(

      'Logout',

      'Are you sure you want to logout?',

      [

        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Logout',

          style: 'destructive',

          onPress: logout,
        },
      ]
    );
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading dashboard...
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

      <SafeAreaView style={{ flex: 1 }}>

        <ScrollView

          showsVerticalScrollIndicator={
            false
          }

          refreshControl={

            <RefreshControl

              refreshing={
                refreshing
              }

              onRefresh={
                onRefresh
              }

              tintColor={
                COLORS.primary
              }
            />
          }

          contentContainerStyle={
            styles.scroll
          }
        >

          {/* HEADER */}

          <View style={styles.header}>

            <View>

              <Text style={styles.welcome}>
                Enterprise Leadership
              </Text>

              <Text style={styles.title}>
                Team Leader
              </Text>

              <Text style={styles.subtitle}>
                Enterprise operations center
              </Text>

            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogout}
            >

              <LinearGradient

                colors={
                  COLORS.gradientDanger
                }

                style={styles.profileBtn}
              >

                <Ionicons
                  name="log-out-outline"
                  size={28}
                  color="#FFFFFF"
                />

              </LinearGradient>

            </TouchableOpacity>

          </View>

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
                  Team Operations
                </Text>

                <Text style={styles.heroSub}>
                  AI workforce monitoring
                </Text>

              </View>

              <Ionicons
                name="people"
                size={52}
                color="#FFFFFF"
              />

            </View>

            <View style={styles.heroStats}>

              <HeroStat
                value={
                  dashboard.employees
                }
                label="Employees"
              />

              <HeroStat
                value={`${dashboard.attendance}%`}
                label="Attendance"
              />

              <HeroStat
                value={`${dashboard.performance}%`}
                label="Performance"
              />

            </View>

          </LinearGradient>

          {/* ANALYTICS */}

          <Text style={styles.sectionTitle}>
            Team Analytics
          </Text>

          <View style={styles.analyticsRow}>

            <AnalyticsCard
              title="Present"
              value={dashboard.present}
              icon="checkmark-circle"
              color="#00D097"
            />

            <AnalyticsCard
              title="Absent"
              value={dashboard.absent}
              icon="close-circle"
              color="#FF4F6D"
            />

          </View>

          <View style={styles.analyticsRow}>

            <AnalyticsCard
              title="Late"
              value={dashboard.late}
              icon="time"
              color="#FFB547"
            />

            <AnalyticsCard
              title="WFH"
              value={dashboard.wfh}
              icon="home"
              color="#7C5CFF"
            />

          </View>

          {/* QUICK ACCESS */}

          <Text style={styles.sectionTitle}>
            Operations Center
          </Text>

          <View style={styles.grid}>

            <QuickCard
              title="Attendance"
              subtitle="Live attendance tracking"
              icon="calendar"
              color="#4F8EF7"
              onPress={() =>
                navigation.navigate(
                  'TeamAttendance'
                )
              }
            />

            <QuickCard
              title="Members"
              subtitle="Manage team employees"
              icon="people"
              color="#00D097"
              onPress={() =>
                navigation.navigate(
                  'TeamMembers'
                )
              }
            />

            <QuickCard
              title="Analytics"
              subtitle="Performance insights"
              icon="stats-chart"
              color="#FFBB33"
              onPress={() =>
                navigation.navigate(
                  'TeamAnalytics'
                )
              }
            />

            <QuickCard
              title="Reports"
              subtitle="Team reports center"
              icon="bar-chart"
              color="#FF4444"
              onPress={() =>
                navigation.navigate(
                  'TeamReport'
                )
              }
            />

            <QuickCard
              title="Face Register"
              subtitle="AI biometric registration"
              icon="scan-circle"
              color="#AA66CC"
              onPress={() =>
                navigation.navigate(
                  'TLFaceRegister'
                )
              }
            />

            <QuickCard
              title="Dashboard"
              subtitle="Productivity overview"
              icon="analytics"
              color="#4ECDC4"
              onPress={() =>
                navigation.navigate(
                  'TeamDashboard'
                )
              }
            />

          </View>

          {/* AI MONITORING */}

          <Text style={styles.sectionTitle}>
            AI Monitoring
          </Text>

          <View style={styles.aiCard}>

            <AIStatus
              text="Face verification active"
            />

            <AIStatus
              text="Liveness detection enabled"
            />

            <AIStatus
              text="Anti-spoofing active"
            />

            <AIStatus
              text={`AI Accuracy ${dashboard.aiAccuracy}`}
            />

          </View>

          {/* LIVE ACTIVITIES */}

          <Text style={styles.sectionTitle}>
            Live Activities
          </Text>

          <View style={styles.activityCard}>

            {

              dashboard.activities.map(
                (item, index) => (

                <ActivityRow
                  key={index}
                  text={item}
                />
              ))
            }

          </View>

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================
// QUICK CARD
// =====================================

function QuickCard({

  title,
  subtitle,
  icon,
  color,
  onPress,

}) {

  return (

    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
    >

      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor:
              `${color}22`,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={30}
          color={color}
        />

      </View>

      <Text style={styles.cardText}>
        {title}
      </Text>

      <Text style={styles.cardSub}>
        {subtitle}
      </Text>

    </TouchableOpacity>
  );
}

// =====================================
// ANALYTICS CARD
// =====================================

function AnalyticsCard({

  title,
  value,
  icon,
  color,

}) {

  return (

    <View style={styles.analyticsCard}>

      <View
        style={[
          styles.analyticsIcon,
          {
            backgroundColor:
              `${color}22`,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={24}
          color={color}
        />

      </View>

      <Text style={styles.analyticsValue}>
        {value}
      </Text>

      <Text style={styles.analyticsTitle}>
        {title}
      </Text>

    </View>
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
// AI STATUS
// =====================================

function AIStatus({
  text,
}) {

  return (

    <View style={styles.aiRow}>

      <Ionicons
        name="shield-checkmark"
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.aiText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// ACTIVITY ROW
// =====================================

function ActivityRow({
  text,
}) {

  return (

    <View style={styles.activityRow}>

      <Ionicons
        name="pulse"
        size={18}
        color="#00D097"
      />

      <Text style={styles.activityText}>
        {text}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050816',
  },

  loader: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor:
      '#050816',
  },

  loadingText: {

    color: '#FFFFFF',

    marginTop: 14,
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

  welcome: {

    color: COLORS.textSecondary,

    fontSize: 14,
  },

  title: {

    color: '#FFFFFF',

    fontSize: 34,

    fontWeight: '800',
  },

  subtitle: {

    color: COLORS.textMuted,

    marginTop: 6,
  },

  profileBtn: {

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

    marginBottom: 30,

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

    color:
      'rgba(255,255,255,0.85)',

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

    fontSize: 28,

    fontWeight: '800',
  },

  heroLabel: {

    color:
      'rgba(255,255,255,0.82)',

    marginTop: 6,
  },

  sectionTitle: {

    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '800',

    marginBottom: 18,

    marginTop: 10,
  },

  analyticsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: 16,
  },

  analyticsCard: {

    width: '48%',

    backgroundColor:
      '#151D35',

    borderRadius: 22,

    padding: 20,
  },

  analyticsIcon: {

    width: 52,

    height: 52,

    borderRadius: 18,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  analyticsValue: {

    color: '#FFFFFF',

    fontSize: 28,

    fontWeight: '800',
  },

  analyticsTitle: {

    color: COLORS.textSecondary,

    marginTop: 6,
  },

  grid: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginBottom: 24,
  },

  card: {

    width: '48%',

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    marginBottom: 16,

    borderWidth: 1,

    borderColor: '#1E2A45',
  },

  iconWrap: {

    width: 68,

    height: 68,

    borderRadius: 22,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  cardText: {

    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '800',
  },

  cardSub: {

    color: COLORS.textSecondary,

    marginTop: 8,

    lineHeight: 20,

    fontSize: 13,
  },

  aiCard: {

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    marginBottom: 24,
  },

  aiRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  aiText: {

    color: '#FFFFFF',

    marginLeft: 12,
  },

  activityCard: {

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    marginBottom: 40,
  },

  activityRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  activityText: {

    color: '#FFFFFF',

    marginLeft: 12,

    flex: 1,
  },

});