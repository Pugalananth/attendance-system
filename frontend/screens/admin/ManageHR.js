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

export default function ManageHR() {

  // =====================================
  // HR DATA
  // =====================================

  const [hrList,
    setHrList] =
      useState([

    {
      id: 1,
      name: 'Sophia',
      email:
        'sophia@company.com',
      department: 'Human Resources',
      status: 'Active',
    },

    {
      id: 2,
      name: 'David',
      email:
        'david@company.com',
      department: 'Operations',
      status: 'Inactive',
    },

    {
      id: 3,
      name: 'Emma',
      email:
        'emma@company.com',
      department: 'Finance',
      status: 'Active',
    },

  ]);

  // =====================================
  // ADD HR
  // =====================================

  const addHR = () => {

    const newHR = {

      id:
        hrList.length + 1,

      name:
        `HR ${hrList.length + 1}`,

      email:
        `hr${hrList.length + 1}@company.com`,

      department:
        'New Department',

      status: 'Active',
    };

    setHrList([
      ...hrList,
      newHR,
    ]);

    Alert.alert(
      'Success',
      'New HR added successfully'
    );
  };

  // =====================================
  // TOGGLE STATUS
  // =====================================

  const toggleStatus =
    (id) => {

    setHrList(

      hrList.map((item) =>

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
  // DELETE HR
  // =====================================

  const deleteHR =
    (id) => {

    Alert.alert(

      'Delete HR',

      'Are you sure you want to remove this HR member?',

      [

        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',

          style: 'destructive',

          onPress: () => {

            setHrList(

              hrList.filter(
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

  const activeCount =
    hrList.filter(
      (i) =>
        i.status === 'Active'
    ).length;

  const inactiveCount =
    hrList.filter(
      (i) =>
        i.status === 'Inactive'
    ).length;

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
                Enterprise Management
              </Text>

              <Text style={styles.title}>
                Manage HR
              </Text>

              <Text style={styles.subtitle}>
                HR hierarchy & operations
              </Text>

            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={addHR}
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
                  HR Operations
                </Text>

                <Text style={styles.heroSub}>
                  Enterprise HR management
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
                value={hrList.length}
                label="Total HR"
              />

              <HeroStat
                value={activeCount}
                label="Active"
              />

              <HeroStat
                value={inactiveCount}
                label="Inactive"
              />

            </View>

          </LinearGradient>

          {/* SECTION */}

          <Text style={styles.sectionTitle}>
            HR Members
          </Text>

          {/* HR LIST */}

          {

            hrList.map((item) => (

              <HRCard

                key={item.id}

                item={item}

                onToggle={
                  toggleStatus
                }

                onDelete={
                  deleteHR
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
// HR CARD
// =====================================

function HRCard({

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

            <Text style={styles.avatarText}>
              {item.name[0]}
            </Text>

          </View>

          <View>

            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.email}>
              {item.email}
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

    marginBottom: 20,
  },

  infoText: {

    color: COLORS.textSecondary,

    marginLeft: 10,
  },

  actionRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',
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