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
  ActivityIndicator,
  RefreshControl,
  Alert,
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

  COLORS,
  FONTS,
  SHADOWS,

} from '../../constants/theme';

// import api from '../../services/api';

export default function TeamMembers({
  navigation,
}) {

  // =====================================
  // STATES
  // =====================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [members,
    setMembers] =
      useState([]);

  // =====================================
  // LOAD MEMBERS
  // =====================================

  const loadMembers =
    async () => {

    try {

      setLoading(true);

      // =================================
      // BACKEND API
      // =================================

      /*
      const response =
        await api.get(
          '/team/members'
        );

      setMembers(
        response.data
      );
      */

      // =================================
      // MOCK DATA
      // =================================

      setTimeout(() => {

        setMembers([

          {
            id: 1,
            name:
              'Arun Kumar',
            role:
              'Frontend Developer',
            department:
              'Development',
            status:
              'Active',
            performance:
              '94%',
          },

          {
            id: 2,
            name:
              'Sophia',
            role:
              'UI/UX Designer',
            department:
              'Design',
            status:
              'Active',
            performance:
              '91%',
          },

          {
            id: 3,
            name:
              'David',
            role:
              'QA Engineer',
            department:
              'Testing',
            status:
              'Inactive',
            performance:
              '78%',
          },

          {
            id: 4,
            name:
              'Emma',
            role:
              'Backend Developer',
            department:
              'Development',
            status:
              'Active',
            performance:
              '97%',
          },

        ]);

        setLoading(false);

      }, 1200);

    } catch (error) {

      console.log(error);

      setLoading(false);

      Alert.alert(
        'Error',
        'Failed to load members'
      );
    }
  };

  // =====================================
  // REFRESH
  // =====================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadMembers();

    setRefreshing(false);
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {

    loadMembers();

  }, []);

  // =====================================
  // ANALYTICS
  // =====================================

  const activeMembers =
    members.filter(
      (i) =>
        i.status === 'Active'
    ).length;

  const inactiveMembers =
    members.filter(
      (i) =>
        i.status === 'Inactive'
    ).length;

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
          Loading team members...
        </Text>

      </View>
    );
  }

  return (

    <View style={styles.container}>

      {/* BACKGROUND */}

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

              <Text style={styles.smallText}>
                Enterprise Team Management
              </Text>

              <Text style={styles.title}>
                Team Members
              </Text>

              <Text style={styles.subtitle}>
                Employee supervision center
              </Text>

            </View>

            <LinearGradient

              colors={
                COLORS.gradientPrimary
              }

              style={styles.headerIcon}
            >

              <Ionicons
                name="people"
                size={28}
                color="#FFFFFF"
              />

            </LinearGradient>

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
                  Team Workforce
                </Text>

                <Text style={styles.heroSub}>
                  Enterprise employee monitoring
                </Text>

              </View>

              <Ionicons
                name="analytics"
                size={48}
                color="#FFFFFF"
              />

            </View>

            <View style={styles.heroStats}>

              <HeroStat
                value={members.length}
                label="Members"
              />

              <HeroStat
                value={activeMembers}
                label="Active"
              />

              <HeroStat
                value={inactiveMembers}
                label="Inactive"
              />

            </View>

          </LinearGradient>

          {/* SECTION */}

          <Text style={styles.sectionTitle}>
            Team Employees
          </Text>

          {/* LIST */}

          {

            members.map((item) => (

              <MemberCard
                key={item.id}
                item={item}
              />
            ))
          }

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================
// MEMBER CARD
// =====================================

function MemberCard({
  item,
}) {

  const isActive =
    item.status === 'Active';

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
    >

      {/* TOP */}

      <View style={styles.cardTop}>

        <View style={styles.leftRow}>

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              {item.name[0]}
            </Text>

          </View>

          <View>

            <Text style={styles.employee}>
              {item.name}
            </Text>

            <Text style={styles.role}>
              {item.role}
            </Text>

          </View>

        </View>

        {/* STATUS */}

        <View
          style={[

            styles.statusBadge,

            {
              backgroundColor:

                isActive

                  ? '#00D09722'

                  : '#FF4F6D22',
            },
          ]}
        >

          <Text
            style={[

              styles.statusText,

              {
                color:

                  isActive

                    ? '#00D097'

                    : '#FF4F6D',
              },
            ]}
          >
            {item.status}
          </Text>

        </View>

      </View>

      {/* DEPARTMENT */}

      <View style={styles.infoRow}>

        <Ionicons
          name="business"
          size={18}
          color={COLORS.textMuted}
        />

        <Text style={styles.infoText}>
          {item.department}
        </Text>

      </View>

      {/* PERFORMANCE */}

      <View style={styles.infoRow}>

        <Ionicons
          name="stats-chart"
          size={18}
          color={COLORS.textMuted}
        />

        <Text style={styles.infoText}>
          Performance: {item.performance}
        </Text>

      </View>

    </TouchableOpacity>
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
// STYLES
// =====================================

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

    fontSize: 30,

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
  },

  card: {

    backgroundColor:
      '#151D35',

    borderRadius: 24,

    padding: 22,

    marginBottom: 18,

    borderWidth: 1,

    borderColor: '#1E2A45',
  },

  cardTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 20,
  },

  leftRow: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  avatar: {

    width: 62,

    height: 62,

    borderRadius: 20,

    backgroundColor:
      '#4F8EF7',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  avatarText: {

    color: '#FFFFFF',

    fontSize: 22,

    fontWeight: '800',
  },

  employee: {

    color: '#FFFFFF',

    fontSize: 18,

    fontWeight: '800',
  },

  role: {

    color: COLORS.textSecondary,

    marginTop: 6,
  },

  statusBadge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 14,
  },

  statusText: {

    fontWeight: '700',

    fontSize: 12,
  },

  infoRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 14,
  },

  infoText: {

    color: COLORS.textSecondary,

    marginLeft: 10,
  },

});