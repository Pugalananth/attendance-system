import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Alert,
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

import PrimaryButton from
'../../components/ui/PrimaryButton';

import {
  COLORS,
  FONTS,
  SPACING,
  RADIUS,
} from '../../constants/theme';

export default function EmployeeApprovalScreen({
  navigation,
}) {

  const [employees,
    setEmployees] =
      useState([
        {
          id: 1,
          name: 'Arun Kumar',
          email: 'arun@gmail.com',
          department: 'Development',
          status: 'Pending',
        },

        {
          id: 2,
          name: 'Sophia',
          email: 'sophia@gmail.com',
          department: 'UI/UX',
          status: 'Pending',
        },
      ]);

  // =========================================
  // UPDATE STATUS
  // =========================================

  const updateStatus = (
    id,
    status
  ) => {

    const updated =
      employees.map((item) => {

      if (item.id === id) {

        return {
          ...item,
          status,
        };
      }

      return item;
    });

    setEmployees(updated);

    Alert.alert(
      status,
      `Employee ${status.toLowerCase()}`
    );
  };

  return (

    <ScreenContainer>

      {/* HEADER */}

      <AppHeader
        title="Employee Approval"
        subtitle="HR employee verification"
        navigation={navigation}
        showBack
      />

      {/* STATS */}

      <View style={styles.statsRow}>

        <StatsCard
          title="Pending"
          value="02"
          icon="time"
          colors={COLORS.gradientDanger}
        />

        <StatsCard
          title="Approved"
          value="24"
          icon="checkmark-circle"
          colors={COLORS.gradientSuccess}
        />

      </View>

      {/* SECTION */}

      <Text style={styles.sectionTitle}>
        Pending Employees
      </Text>

      {/* EMPLOYEES */}

      {employees.map((item) => (

        <GlassCard key={item.id}>

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

              </View>

            </View>

            <View
              style={[
                styles.badge,

                item.status ===
                'Approved' && {
                  backgroundColor:
                    COLORS.success,
                },

                item.status ===
                'Rejected' && {
                  backgroundColor:
                    COLORS.error,
                },
              ]}
            >

              <Text style={styles.badgeText}>
                {item.status}
              </Text>

            </View>

          </View>

          {/* DETAILS */}

          <View style={styles.detailRow}>

            <Ionicons
              name="business"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.department}>
              {item.department}
            </Text>

          </View>

          {/* BUTTONS */}

          {item.status ===
            'Pending' && (

            <View style={styles.buttonRow}>

              <PrimaryButton
                title="Approve"
                colors={
                  COLORS.gradientSuccess
                }
                onPress={() =>
                  updateStatus(
                    item.id,
                    'Approved'
                  )
                }
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              />

              <PrimaryButton
                title="Reject"
                colors={
                  COLORS.gradientDanger
                }
                onPress={() =>
                  updateStatus(
                    item.id,
                    'Rejected'
                  )
                }
                style={{
                  flex: 1,
                  marginLeft: 8,
                }}
              />

            </View>
          )}

        </GlassCard>
      ))}

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.lg,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 20,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,
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

  badge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  department: {
    color: COLORS.textSecondary,
    marginLeft: 10,
    fontSize: FONTS.base,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
  },

});