import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  View,
  Text,
 StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TextInput,
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
  employeeAPI,
} from '../../services/api';

import {

  COLORS,
  SHADOWS,

} from '../../constants/theme';

export default function EmployeeManagement({
  navigation,
}) {

  // =====================================================
  // STATES
  // =====================================================

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [employees,
    setEmployees] =
      useState([]);

  const [search,
    setSearch] =
      useState('');

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  const loadEmployees =
    useCallback(async () => {

      try {

        setLoading(true);

        const response =
          await employeeAPI
            .getEmployees();

        console.log(
          'EMPLOYEES:',
          response?.data
        );

        const data =

          response?.data
            ?.employees ||

          response?.data
            ?.data ||

          [];

        setEmployees(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.log(
          'EMPLOYEE ERROR:',
          error
        );

        Alert.alert(

          'Error',

          error?.response?.data
            ?.message ||
          'Failed to load employees'

        );

      } finally {

        setLoading(false);

        setRefreshing(false);
      }

    }, []);

  // =====================================================
  // INIT
  // =====================================================

  useEffect(() => {

    loadEmployees();

  }, []);

  // =====================================================
  // REFRESH
  // =====================================================

  const onRefresh =
    async () => {

    setRefreshing(true);

    await loadEmployees();
  };

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const deleteEmployee =
    async (id) => {

    Alert.alert(

      'Delete Employee',

      'Are you sure you want to remove this employee?',

      [

        {
          text: 'Cancel',
          style: 'cancel',
        },

        {

          text: 'Delete',

          style: 'destructive',

          onPress: async () => {

            try {

              await employeeAPI
                .deleteEmployee(id);

              const updated =
                employees.filter(

                  (item) =>

                    item.employee_id !== id &&

                    item._id !== id &&

                    item.id !== id
                );

              setEmployees(updated);

              Alert.alert(

                'Success',

                'Employee deleted successfully'

              );

            } catch (error) {

              console.log(error);

              Alert.alert(

                'Error',

                error?.response?.data
                  ?.message ||
                'Delete failed'

              );
            }
          },
        },
      ]
    );
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredEmployees =

    employees.filter((item) => {

      const name =

        item.name ||

        item.employee_name ||

        '';

      return name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );
    });

  // =====================================================
  // ANALYTICS
  // =====================================================

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(

      (i) =>

        i.status !== 'Inactive'

    ).length;

  const inactiveEmployees =

    totalEmployees -
    activeEmployees;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <View style={styles.loaderWrap}>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading Employees...
        </Text>

      </View>
    );
  }

  // =====================================================
  // UI
  // =====================================================

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

          contentContainerStyle={
            styles.scroll
          }

          refreshControl={

            <RefreshControl

              refreshing={refreshing}

              onRefresh={onRefresh}

              tintColor={COLORS.primary}

            />
          }
        >

          {/* HEADER */}

          <View style={styles.header}>

            <View>

              <Text style={styles.smallText}>
                Enterprise HR System
              </Text>

              <Text style={styles.title}>
                Employee Management
              </Text>

              <Text style={styles.subtitle}>
                Workforce management operations
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

          {/* SEARCH */}

          <View style={styles.searchBox}>

            <Ionicons
              name="search"
              size={22}
              color="#999"
            />

            <TextInput

              placeholder="Search employee..."

              placeholderTextColor="#777"

              value={search}

              onChangeText={setSearch}

              style={styles.searchInput}

            />

          </View>

          {/* HERO */}

          <LinearGradient

            colors={
              COLORS.gradientPrimary
            }

            style={styles.heroCard}
          >

            <View style={styles.heroStats}>

              <HeroStat
                value={totalEmployees}
                label="Total"
              />

              <HeroStat
                value={activeEmployees}
                label="Active"
              />

              <HeroStat
                value={inactiveEmployees}
                label="Inactive"
              />

            </View>

          </LinearGradient>

          {/* EMPLOYEE LIST */}

          <Text style={styles.sectionTitle}>
            Employee Directory
          </Text>

          {

            filteredEmployees.length === 0 ? (

              <View style={styles.emptyCard}>

                <Ionicons
                  name="people"
                  size={60}
                  color="#666"
                />

                <Text style={styles.emptyText}>
                  No employees found
                </Text>

              </View>

            ) : (

              filteredEmployees.map(

                (item, index) => (

                <EmployeeCard

                  key={
                    item._id ||
                    item.id ||
                    index
                  }

                  item={item}

                  onDelete={
                    deleteEmployee
                  }
                />
              ))
            )
          }

        </ScrollView>

      </SafeAreaView>

    </View>
  );
}

// =====================================================
// EMPLOYEE CARD
// =====================================================

function EmployeeCard({
  item,
  onDelete,
}) {

  const name =
    item.name ||
    item.employee_name ||
    'Unknown';

  const role =
    item.role ||
    'Employee';

  const department =
    item.department ||
    'General';

  const email =
    item.email ||
    'No Email';

  return (

    <View style={styles.card}>

      <View style={styles.cardTop}>

        <View style={styles.leftRow}>

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>
              {name[0]}
            </Text>

          </View>

          <View>

            <Text style={styles.employeeName}>
              {name}
            </Text>

            <Text style={styles.role}>
              {role}
            </Text>

          </View>

        </View>

        <TouchableOpacity

          onPress={() =>

            onDelete(

              item._id ||
              item.employee_id ||
              item.id

            )

          }
        >

          <Ionicons
            name="trash"
            size={24}
            color="#FF4F6D"
          />

        </TouchableOpacity>

      </View>

      <View style={styles.infoRow}>

        <Ionicons
          name="mail"
          size={18}
          color="#999"
        />

        <Text style={styles.infoText}>
          {email}
        </Text>

      </View>

      <View style={styles.infoRow}>

        <Ionicons
          name="business"
          size={18}
          color="#999"
        />

        <Text style={styles.infoText}>
          {department}
        </Text>

      </View>

    </View>
  );
}

// =====================================================
// HERO STAT
// =====================================================

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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#050816',
  },

  loaderWrap: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  loadingText: {

    color: '#fff',

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

  smallText: {

    color: COLORS.textSecondary,
  },

  title: {

    color: '#fff',

    fontSize: 32,

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
  },

  searchBox: {

    backgroundColor: '#151D35',

    borderRadius: 20,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 18,

    marginBottom: 24,
  },

  searchInput: {

    flex: 1,

    color: '#fff',

    paddingHorizontal: 12,

    height: 56,
  },

  heroCard: {

    borderRadius: 28,

    padding: 24,

    marginBottom: 30,
  },

  heroStats: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  heroStat: {

    alignItems: 'center',
  },

  heroValue: {

    color: '#fff',

    fontSize: 30,

    fontWeight: '800',
  },

  heroLabel: {

    color:
      'rgba(255,255,255,0.82)',

    marginTop: 6,
  },

  sectionTitle: {

    color: '#fff',

    fontSize: 20,

    fontWeight: '800',

    marginBottom: 20,
  },

  emptyCard: {

    backgroundColor: '#151D35',

    borderRadius: 24,

    padding: 40,

    alignItems: 'center',
  },

  emptyText: {

    color: '#999',

    marginTop: 18,
  },

  card: {

    backgroundColor: '#151D35',

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

    marginBottom: 18,
  },

  leftRow: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  avatar: {

    width: 60,

    height: 60,

    borderRadius: 20,

    backgroundColor: '#4F8EF7',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  avatarText: {

    color: '#fff',

    fontSize: 22,

    fontWeight: '800',
  },

  employeeName: {

    color: '#fff',

    fontSize: 18,

    fontWeight: '800',
  },

  role: {

    color: COLORS.textSecondary,

    marginTop: 6,
  },

  infoRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 12,
  },

  infoText: {

    color: COLORS.textSecondary,

    marginLeft: 10,
  },

});
