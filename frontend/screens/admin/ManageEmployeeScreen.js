import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import ScreenContainer from
'../../components/ui/ScreenContainer';

import AppHeader from
'../../components/ui/AppHeader';

import GlassCard from
'../../components/ui/GlassCard';

import StatsCard from
'../../components/ui/StatsCard';

import {
  employeeAPI,
} from '../../services/api';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
} from '../../constants/theme';

export default function ManageEmployeesScreen({
  navigation,
}) {

  // =====================================================
  // STATES
  // =====================================================

  const [search,
    setSearch] =
      useState('');

  const [employees,
    setEmployees] =
      useState([]);

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  useEffect(() => {

    loadEmployees();

  }, []);

  const loadEmployees =
    async () => {

    try {

      setLoading(true);

      const response =
        await employeeAPI
          .getEmployees();

      const result =
        response.data;

      if (result.success) {

        setEmployees(
          result.employees || []
        );
      }

    } catch (error) {

      console.log(
        'EMPLOYEE LOAD ERROR:',
        error
      );

      Alert.alert(
        'Error',
        'Failed to load employees'
      );

    } finally {

      setLoading(false);

      setRefreshing(false);
    }
  };

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const deleteEmployee =
    (employeeId) => {

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

              const response =
                await employeeAPI
                  .deleteEmployee(
                    employeeId
                  );

              const result =
                response.data;

              if (result.success) {

                Alert.alert(
                  'Success',
                  'Employee deleted successfully'
                );

                loadEmployees();

              } else {

                Alert.alert(
                  'Error',
                  result.message
                );
              }

            } catch (error) {

              console.log(
                'DELETE ERROR:',
                error
              );

              Alert.alert(
                'Error',
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

      const query =
        search.toLowerCase();

      return (

        item.name
          ?.toLowerCase()
          .includes(query)

        ||

        item.email
          ?.toLowerCase()
          .includes(query)

        ||

        item.employee_id
          ?.toLowerCase()
          .includes(query)

      );
    });

  // =====================================================
  // STATS
  // =====================================================

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(

      (item) =>
        item.is_active !== false

    ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <ScreenContainer>

        <View style={styles.loaderContainer}>

          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />

          <Text style={styles.loaderText}>
            Loading Employees...
          </Text>

        </View>

      </ScreenContainer>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <ScreenContainer>

      {/* HEADER */}

      <AppHeader
        title="Manage Employees"
        subtitle="Enterprise employee management"
        navigation={navigation}
        showBack
      />

      {/* STATS */}

      <View style={styles.statsRow}>

        <StatsCard
          title="Employees"
          value={String(totalEmployees)}
          icon="people"
          colors={COLORS.gradientPrimary}
        />

        <StatsCard
          title="Active"
          value={String(activeEmployees)}
          icon="checkmark-circle"
          colors={COLORS.gradientSuccess}
        />

      </View>

      {/* SEARCH */}

      <GlassCard>

        <View style={styles.searchContainer}>

          <Ionicons
            name="search"
            size={20}
            color={COLORS.textMuted}
          />

          <TextInput
            placeholder="Search employee..."
            placeholderTextColor={
              COLORS.textMuted
            }
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

        </View>

      </GlassCard>

      {/* EMPLOYEE LIST */}

      <FlatList

        data={filteredEmployees}

        keyExtractor={(item) =>

          item.employee_id ||
          item.id ||
          Math.random().toString()

        }

        showsVerticalScrollIndicator={false}

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={() => {

              setRefreshing(true);

              loadEmployees();
            }}

          />

        }

        ListEmptyComponent={

          <GlassCard>

            <View style={styles.emptyContainer}>

              <Ionicons
                name="people-outline"
                size={60}
                color={COLORS.textMuted}
              />

              <Text style={styles.emptyText}>
                No employees found
              </Text>

            </View>

          </GlassCard>

        }

        renderItem={({ item }) => (

          <GlassCard>

            {/* TOP */}

            <View style={styles.topRow}>

              <View style={styles.employeeRow}>

                <View style={styles.avatar}>

                  <Ionicons
                    name="person"
                    size={24}
                    color="#fff"
                  />

                </View>

                <View>

                  <Text style={styles.name}>
                    {item.name}
                  </Text>

                  <Text style={styles.email}>
                    {item.email}
                  </Text>

                  <Text style={styles.employeeId}>
                    {item.employee_id}
                  </Text>

                </View>

              </View>

              <TouchableOpacity

                onPress={() =>

                  deleteEmployee(
                    item.employee_id
                  )

                }

              >

                <Ionicons
                  name="trash"
                  size={24}
                  color={COLORS.error}
                />

              </TouchableOpacity>

            </View>

            {/* DETAILS */}

            <View style={styles.detailsRow}>

              <View style={styles.departmentBox}>

                <Ionicons
                  name="business"
                  size={16}
                  color="#fff"
                />

                <Text style={styles.departmentText}>
                  {item.department || 'General'}
                </Text>

              </View>

              <View
                style={[

                  styles.statusBadge,

                  {

                    backgroundColor:

                      item.is_active === false

                        ? COLORS.error
                        : COLORS.success,
                  },

                ]}
              >

                <Text style={styles.statusText}>

                  {item.is_active === false

                    ? 'Inactive'

                    : 'Active'}

                </Text>

              </View>

            </View>

          </GlassCard>
        )}
      />

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    color: COLORS.textPrimary,
    marginTop: 14,
    fontSize: FONTS.base,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyText: {
    color: COLORS.textMuted,
    marginTop: 14,
    fontSize: FONTS.base,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    height: 56,
  },

  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    marginLeft: 12,
    fontSize: FONTS.base,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  name: {
    color: COLORS.textPrimary,
    fontSize: FONTS.base,
    fontWeight: '800',
  },

  email: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  employeeId: {
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '700',
    fontSize: 12,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },

  departmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  departmentText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '700',
    fontSize: 12,
  },

  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

});