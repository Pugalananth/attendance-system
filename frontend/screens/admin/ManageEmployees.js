import React, {
  useEffect,
  useState,
} from 'react';

import {

  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Modal,
  ScrollView,

} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {

  employeeAPI,
  authAPI,

} from '../../services/api';

import {

  COLORS,
  FONTS,
  SPACING,
  RADIUS,

} from '../../constants/theme';

export default function ManageEmployees({
  navigation,
}) {

  // =====================================================
  // STATES
  // =====================================================

  const [employees,
    setEmployees] =
      useState([]);

  const [filteredEmployees,
    setFilteredEmployees] =
      useState([]);

  const [loading,
    setLoading] =
      useState(true);

  const [refreshing,
    setRefreshing] =
      useState(false);

  const [search,
    setSearch] =
      useState('');

  const [showModal,
    setShowModal] =
      useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const [name,
    setName] =
      useState('');

  const [email,
    setEmail] =
      useState('');

  const [password,
    setPassword] =
      useState('');

  const [department,
    setDepartment] =
      useState('');

  const [role,
    setRole] =
      useState('employee');

  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  const fetchEmployees =
    async () => {

    try {

      const response =
        await employeeAPI
          .getEmployees();

      const result =
        response.data;

      if (result.success) {

        setEmployees(
          result.employees || []
        );

        setFilteredEmployees(
          result.employees || []
        );
      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'Failed to fetch employees'
      );

    } finally {

      setLoading(false);

      setRefreshing(false);
    }
  };

  useEffect(() => {

    fetchEmployees();

  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  useEffect(() => {

    const filtered =
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

    setFilteredEmployees(
      filtered
    );

  }, [search, employees]);

  // =====================================================
  // CREATE EMPLOYEE
  // =====================================================

  const createEmployee =
    async () => {

    try {

      if (

        !name ||
        !email ||
        !password

      ) {

        Alert.alert(
          'Validation',
          'Please fill all fields'
        );

        return;
      }

      const response =
        await authAPI.register({

          name,
          email,
          password,
          role,
          department,

        });

      const result =
        response.data;

      if (result.success) {

        Alert.alert(
          'Success',
          'Employee created successfully'
        );

        setShowModal(false);

        setName('');
        setEmail('');
        setPassword('');
        setDepartment('');
        setRole('employee');

        fetchEmployees();

      } else {

        Alert.alert(
          'Error',
          result.message
        );
      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        error?.response?.data
          ?.message ||

        'Employee creation failed'
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteEmployee =
    async (employeeId) => {

    Alert.alert(

      'Delete Employee',

      'Are you sure?',

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
                  'Employee deleted'
                );

                fetchEmployees();

              } else {

                Alert.alert(
                  'Error',
                  result.message
                );
              }

            } catch (error) {

              console.log(error);

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
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="#4F8EF7"
        />

      </View>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <SafeAreaView
      style={styles.container}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Ionicons
            name="arrow-back"
            size={26}
            color="white"
          />

        </TouchableOpacity>

        <Text style={styles.title}>
          Manage Employees
        </Text>

        <TouchableOpacity
          onPress={() =>
            setShowModal(true)
          }
        >

          <Ionicons
            name="add-circle"
            size={32}
            color="#4F8EF7"
          />

        </TouchableOpacity>

      </View>

      {/* SEARCH */}

      <View style={styles.searchBox}>

        <Ionicons
          name="search"
          size={20}
          color="#888"
        />

        <TextInput
          placeholder="Search employee..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

      </View>

      {/* LIST */}

      <FlatList

        data={filteredEmployees}

        keyExtractor={(item) =>
          item.employee_id
        }

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={() => {

              setRefreshing(true);

              fetchEmployees();
            }}

          />

        }

        contentContainerStyle={{
          padding: 20,
        }}

        renderItem={({ item }) => (

          <View style={styles.card}>

            {/* TOP */}

            <View style={styles.topRow}>

              <View style={styles.avatar}>

                <Text
                  style={
                    styles.avatarText
                  }
                >
                  {
                    item.name?.charAt(0)
                  }
                </Text>

              </View>

              <View
                style={{ flex: 1 }}
              >

                <Text
                  style={
                    styles.name
                  }
                >
                  {item.name}
                </Text>

                <Text
                  style={
                    styles.meta
                  }
                >
                  {
                    item.employee_id
                  }
                </Text>

              </View>

              <View
                style={[
                  styles.roleBadge,

                  {
                    backgroundColor:

                      item.role ===
                      'admin'

                        ? '#FF444422'

                        : item.role ===
                          'hr'

                        ? '#00C85122'

                        : item.role ===
                          'teamleader'

                        ? '#AA66CC22'

                        : '#4F8EF722',
                  },
                ]}
              >

                <Text
                  style={
                    styles.roleText
                  }
                >
                  {item.role}
                </Text>

              </View>

            </View>

            {/* INFO */}

            <View
              style={styles.infoRow}
            >

              <Ionicons
                name="mail-outline"
                size={16}
                color="#888"
              />

              <Text
                style={styles.infoText}
              >
                {item.email}
              </Text>

            </View>

            <View
              style={styles.infoRow}
            >

              <Ionicons
                name="business"
                size={16}
                color="#888"
              />

              <Text
                style={styles.infoText}
              >
                {
                  item.department ||
                  'General'
                }
              </Text>

            </View>

            {/* ACTIONS */}

            <View style={styles.actions}>

              <TouchableOpacity

                style={styles.actionBtn}

                onPress={() =>

                  navigation.navigate(
                    'FaceRegister'
                  )
                }
              >

                <Ionicons
                  name="scan"
                  size={18}
                  color="#4F8EF7"
                />

                <Text
                  style={
                    styles.actionText
                  }
                >
                  Register Face
                </Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={styles.actionBtn}

                onPress={() =>
                  deleteEmployee(
                    item.employee_id
                  )
                }
              >

                <Ionicons
                  name="trash"
                  size={18}
                  color="#FF4444"
                />

                <Text
                  style={[
                    styles.actionText,
                    {
                      color:
                        '#FF4444',
                    },
                  ]}
                >
                  Delete
                </Text>

              </TouchableOpacity>

            </View>

          </View>
        )}
      />

      {/* CREATE EMPLOYEE MODAL */}

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >

        <View style={styles.modalBg}>

          <View style={styles.modal}>

            <ScrollView>

              <Text style={styles.modalTitle}>
                Create Employee
              </Text>

              <TextInput
                placeholder="Name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />

              <TextInput
                placeholder="Department"
                placeholderTextColor="#666"
                value={department}
                onChangeText={setDepartment}
                style={styles.input}
              />

              {/* ROLE */}

              <Text style={styles.roleLabel}>
                Select Role
              </Text>

              <View style={styles.roles}>

                {[
                  'employee',
                  'hr',
                  'teamleader',
                ].map((item) => (

                  <TouchableOpacity

                    key={item}

                    style={[

                      styles.roleBtn,

                      role === item && {

                        backgroundColor:
                          '#4F8EF7',
                      },

                    ]}

                    onPress={() =>
                      setRole(item)
                    }

                  >

                    <Text
                      style={
                        styles.roleBtnText
                      }
                    >
                      {item}
                    </Text>

                  </TouchableOpacity>
                ))}
              </View>

              {/* BUTTONS */}

              <TouchableOpacity

                style={styles.createBtn}

                onPress={
                  createEmployee
                }

              >

                <Text style={styles.createText}>
                  Create Employee
                </Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={styles.cancelBtn}

                onPress={() =>
                  setShowModal(false)
                }

              >

                <Text style={styles.cancelText}>
                  Cancel
                </Text>

              </TouchableOpacity>

            </ScrollView>

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A1A',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    color: 'white',
    height: 50,
    marginLeft: 10,
  },

  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#4F8EF722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#4F8EF7',
    fontSize: 22,
    fontWeight: 'bold',
  },

  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },

  meta: {
    color: '#888',
    marginTop: 4,
  },

  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  infoText: {
    color: '#CCC',
    marginLeft: 10,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  actionText: {
    color: '#4F8EF7',
    fontWeight: '700',
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },

  modal: {
    backgroundColor: '#1A1A2E',
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    color: 'white',
    marginBottom: 15,
  },

  roleLabel: {
    color: 'white',
    marginBottom: 10,
    fontWeight: '700',
  },

  roles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  roleBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },

  roleBtnText: {
    color: 'white',
    fontWeight: '700',
  },

  createBtn: {
    backgroundColor: '#4F8EF7',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },

  createText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  cancelText: {
    color: '#888',
    fontSize: 15,
  },

});