import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
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

import PrimaryButton from
'../../components/ui/PrimaryButton';

import {
  submitLeaveRequest,
} from '../../services/leaveService';

import {

  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

export default function LeaveRequestScreen({
  navigation,
}) {

  // =====================================
  // STATES
  // =====================================

  const [leaveType,
    setLeaveType] =
      useState('Casual Leave');

  const [startDate,
    setStartDate] =
      useState('');

  const [endDate,
    setEndDate] =
      useState('');

  const [days,
    setDays] =
      useState('');

  const [reason,
    setReason] =
      useState('');

  const [loading,
    setLoading] =
      useState(false);

  // =====================================
  // LEAVE TYPES
  // =====================================

  const leaveTypes = [

    'Casual Leave',

    'Sick Leave',

    'Emergency Leave',

    'Work From Home',

    'Paid Leave',
  ];

  // =====================================
  // SUBMIT
  // =====================================

  const submitLeave =
    async () => {

    if (
      !leaveType ||
      !startDate ||
      !endDate ||
      !days ||
      !reason
    ) {
      Alert.alert(
        'Validation',
        'Please fill all fields'
      );
      return;
    }

    try {
      setLoading(true);

      // =================================
      // API REQUEST
      // =================================

      const payload = {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        total_days: parseInt(days),
        reason,
      };

      console.log(
        'Leave Payload:',
        payload
      );

      const result =
        await submitLeaveRequest(
          payload
        );

      setLoading(false);

      if (result.success) {
        Alert.alert(
          'Success',
          result.message
        );
        navigation.goBack();
      } else {
        Alert.alert(
          'Error',
          result.message
        );
      }

    } catch (error) {
      console.log(
        'LEAVE ERROR:',
        error
      );
      setLoading(false);
      Alert.alert(
        'Error',
        'Failed to submit leave request'
      );
    }
  };

  // =====================================
  // UI
  // =====================================

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
          title="Leave Request"
          subtitle="Apply leave approval"
          navigation={navigation}
          showBack
        />

        {/* FORM */}

        <GlassCard>

          {/* LEAVE TYPE */}

          <Text style={styles.label}>
            Leave Type
          </Text>

          <View style={styles.typeContainer}>

            {
              leaveTypes.map(
                (type, index) => (

                <TouchableOpacity

                  key={index}

                  activeOpacity={0.85}

                  style={[

                    styles.typeButton,

                    leaveType ===
                    type &&

                    styles.activeType,
                  ]}

                  onPress={() =>
                    setLeaveType(type)
                  }
                >

                  <Text
                    style={[

                      styles.typeText,

                      leaveType ===
                      type &&

                      styles.activeTypeText,
                    ]}
                  >
                    {type}
                  </Text>

                </TouchableOpacity>
              ))
            }

          </View>

          {/* START DATE */}

          <Text style={styles.label}>
            Start Date
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="calendar"
              size={20}
              color={COLORS.textMuted}
            />

            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={
                COLORS.textMuted
              }
              value={startDate}
              onChangeText={
                setStartDate
              }
              style={styles.input}
            />

          </View>

          {/* END DATE */}

          <Text style={styles.label}>
            End Date
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="calendar-outline"
              size={20}
              color={COLORS.textMuted}
            />

            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={
                COLORS.textMuted
              }
              value={endDate}
              onChangeText={
                setEndDate
              }
              style={styles.input}
            />

          </View>

          {/* DAYS */}

          <Text style={styles.label}>
            Total Days
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="time"
              size={20}
              color={COLORS.textMuted}
            />

            <TextInput
              placeholder="Enter total leave days"
              placeholderTextColor={
                COLORS.textMuted
              }
              value={days}
              onChangeText={setDays}
              keyboardType="numeric"
              style={styles.input}
            />

          </View>

          {/* REASON */}

          <Text style={styles.label}>
            Leave Reason
          </Text>

          <TextInput
            placeholder="Explain your reason..."
            placeholderTextColor={
              COLORS.textMuted
            }
            value={reason}
            onChangeText={setReason}
            multiline
            style={[
              styles.textArea,
            ]}
          />

          {/* BUTTON */}

          <PrimaryButton

            title="Submit Leave Request"

            onPress={submitLeave}

            loading={loading}

            style={{
              marginTop: 24,
            }}
          />

        </GlassCard>

        {/* POLICY */}

        <GlassCard gradient>

          <View style={styles.policyHeader}>

            <Ionicons
              name="shield-checkmark"
              size={24}
              color="#FFFFFF"
            />

            <Text style={styles.infoTitle}>
              Leave Policy
            </Text>

          </View>

          <PolicyItem
            text="Casual Leave: 12 days/year"
          />

          <PolicyItem
            text="Sick Leave: 10 days/year"
          />

          <PolicyItem
            text="Emergency leave requires HR approval"
          />

          <PolicyItem
            text="Apply leave at least 24 hours before"
          />

          <PolicyItem
            text="HR approval notifications are automatic"
          />

        </GlassCard>

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// POLICY ITEM
// =====================================

function PolicyItem({
  text,
}) {

  return (

    <View style={styles.policyRow}>

      <Ionicons
        name="checkmark-circle"
        size={18}
        color="#00FFB2"
      />

      <Text style={styles.infoText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  label: {

    color: COLORS.textPrimary,

    fontSize: FONTS.base,

    fontWeight: '700',

    marginBottom: 12,

    marginTop: 10,
  },

  typeContainer: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    marginBottom: 18,
  },

  typeButton: {

    paddingHorizontal: 14,

    paddingVertical: 10,

    borderRadius: 16,

    backgroundColor:
      COLORS.bgElevated,

    marginRight: 10,

    marginBottom: 10,

    borderWidth: 1,

    borderColor: COLORS.border,
  },

  activeType: {

    backgroundColor:
      COLORS.primary,
  },

  typeText: {

    color: COLORS.textSecondary,

    fontWeight: '600',
  },

  activeTypeText: {

    color: '#FFFFFF',
  },

  inputContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor:
      COLORS.bgElevated,

    borderRadius: RADIUS.lg,

    paddingHorizontal: 16,

    borderWidth: 1,

    borderColor: COLORS.border,

    marginBottom: 14,
  },

  input: {

    flex: 1,

    color: COLORS.textPrimary,

    paddingVertical: 16,

    marginLeft: 12,

    fontSize: FONTS.base,
  },

  textArea: {

    backgroundColor:
      COLORS.bgElevated,

    borderRadius: RADIUS.lg,

    paddingHorizontal: 16,

    paddingVertical: 16,

    color: COLORS.textPrimary,

    borderWidth: 1,

    borderColor: COLORS.border,

    fontSize: FONTS.base,

    minHeight: 140,

    textAlignVertical: 'top',
  },

  policyHeader: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  infoTitle: {

    color: '#FFFFFF',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginLeft: 12,
  },

  policyRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 14,
  },

  infoText: {

    color:
      'rgba(255,255,255,0.92)',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

});