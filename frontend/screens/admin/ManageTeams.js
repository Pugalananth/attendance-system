import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

export default function ManageTeams() {

  // =====================================
  // TEAM DATA
  // =====================================

  const [teams,
    setTeams] =
      useState([

    {
      id: 1,
      team: 'Frontend Team',
      leader: 'Sophia',
      department:
        'Software Development',
      employees: 8,
      status: 'Active',
    },

    {
      id: 2,
      team: 'Backend Team',
      leader: 'David',
      department:
        'Engineering',
      employees: 6,
      status: 'Active',
    },

    {
      id: 3,
      team: 'AI Research',
      leader: 'Emma',
      department:
        'Artificial Intelligence',
      employees: 4,
      status: 'Inactive',
    },

  ]);

  // =====================================
  // CREATE TEAM
  // =====================================

  const createTeam =
    () => {

    const newTeam = {

      id:
        teams.length + 1,

      team:
        `New Team ${teams.length + 1}`,

      leader:
        'Unassigned',

      department:
        'New Department',

      employees: 0,

      status: 'Active',
    };

    setTeams([
      ...teams,
      newTeam,
    ]);

    Alert.alert(
      'Success',
      'New team created successfully'
    );
  };

  // =====================================
  // TOGGLE STATUS
  // =====================================

  const toggleStatus =
    (id) => {

    setTeams(

      teams.map((item) =>

        item.id === id

          ? {

              ...item,

              status:

                item.status ===
                'Active'

                  ? 'Inactive'

                  : 'Active',
            }

          : item
      )
    );
  };

  // =====================================
  // DELETE TEAM
  // =====================================

  const deleteTeam =
    (id) => {

    Alert.alert(

      'Delete Team',

      'Are you sure you want to remove this team?',

      [

        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',

          style: 'destructive',

          onPress: () => {

            setTeams(

              teams.filter(
                (item) =>
                  item.id !== id
              )
            );
          },
        },
      ]
    );
  };

  // =====================================
  // ANALYTICS
  // =====================================

  const activeTeams =
    teams.filter(
      (i) =>
        i.status === 'Active'
    ).length;

  const totalEmployees =
    teams.reduce(
      (sum, item) =>
        sum + item.employees,
      0
    );

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

          contentContainerStyle={
            styles.scroll
          }
        >

          {/* HEADER */}

          <View style={styles.header}>

            <View>

              <Text style={styles.smallText}>
                Enterprise Organization
              </Text>

              <Text style={styles.title}>
                Manage Teams
              </Text>

              <Text style={styles.subtitle}>
                Team hierarchy & operations
              </Text>

            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={createTeam}
            >

              <LinearGradient

                colors={
                  COLORS.gradientPrimary
                }

                style={styles.addBtn}
              >

                <Ionicons
                  name="add"
                  size={30}
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
                  Enterprise team management
                </Text>

              </View>

              <Ionicons
                name="people"
                size={50}
                color="#FFFFFF"
              />

            </View>

            <View style={styles.heroStats}>

              <HeroStat
                value={teams.length}
                label="Teams"
              />

              <HeroStat
                value={activeTeams}
                label="Active"
              />

              <HeroStat
                value={totalEmployees}
                label="Employees"
              />

            </View>

          </LinearGradient>

          {/* SECTION */}

          <Text style={styles.sectionTitle}>
            Organization Teams
          </Text>

          {/* TEAM LIST */}

          {

            teams.map((item) => (

              <TeamCard

                key={item.id}

                item={item}

                onToggle={
                  toggleStatus
                }

                onDelete={
                  deleteTeam
                }
              />
            ))
          }

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================
// TEAM CARD
// =====================================

function TeamCard({

  item,
  onToggle,
  onDelete,

}) {

  const isActive =
    item.status === 'Active';

  return (

    <View style={styles.card}>

      {/* TOP */}

      <View style={styles.cardTop}>

        <View style={styles.leftRow}>

          <View style={styles.avatar}>

            <Ionicons
              name="people"
              size={28}
              color="#FFFFFF"
            />

          </View>

          <View>

            <Text style={styles.name}>
              {item.team}
            </Text>

            <Text style={styles.email}>
              Leader: {item.leader}
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

      {/* EMPLOYEES */}

      <View style={styles.infoRow}>

        <Ionicons
          name="person"
          size={18}
          color={COLORS.textMuted}
        />

        <Text style={styles.infoText}>
          {item.employees} Employees
        </Text>

      </View>

      {/* ACTIONS */}

      <View style={styles.actionRow}>

        {/* TOGGLE */}

        <TouchableOpacity

          style={[

            styles.actionBtn,

            {
              backgroundColor:

                isActive

                  ? '#FFB547'

                  : '#00D097',
            },
          ]}

          onPress={() =>
            onToggle(item.id)
          }
        >

          <Ionicons
            name={
              isActive
                ? 'pause'
                : 'play'
            }
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.btnText}>

            {
              isActive
                ? 'Disable'
                : 'Enable'
            }

          </Text>

        </TouchableOpacity>

        {/* DELETE */}

        <TouchableOpacity

          style={[

            styles.actionBtn,

            {
              backgroundColor:
                '#FF4F6D',
            },
          ]}

          onPress={() =>
            onDelete(item.id)
          }
        >

          <Ionicons
            name="trash"
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.btnText}>
            Delete
          </Text>

        </TouchableOpacity>

      </View>

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
// STYLES
// =====================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050816',
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

    marginTop: 4,
  },

  subtitle: {

    color: COLORS.textMuted,

    marginTop: 6,
  },

  addBtn: {

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

    marginBottom: 28,
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
      '#7C5CFF',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  name: {

    color: '#FFFFFF',

    fontSize: 18,

    fontWeight: '800',
  },

  email: {

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

    marginBottom: 16,
  },

  infoText: {

    color: COLORS.textSecondary,

    marginLeft: 10,
  },

  actionRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 16,
  },

  actionBtn: {

    width: '48%',

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    paddingVertical: 14,

    borderRadius: 16,
  },

  btnText: {

    color: '#FFFFFF',

    fontWeight: '700',

    marginLeft: 8,
  },

});