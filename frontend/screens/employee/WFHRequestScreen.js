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

  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

import {
  submitWFHRequest,
} from '../../services/wfhService';

export default function WFHRequestScreen({
  navigation,
}) {

  // =====================================
  // STATES
  // =====================================

  const [wfhType,
    setWfhType] =
      useState('Full Day');

  const [startDate,
    setStartDate] =
      useState('');

  const [endDate,
    setEndDate] =
      useState('');

  const [location,
    setLocation] =
      useState('');

  const [reason,
    setReason] =
      useState('');

  const [loading,
    setLoading] =
      useState(false);

  // =====================================
  // WFH TYPES
  // =====================================

  const wfhTypes = [

    'Full Day',

    'Half Day',

    'Emergency WFH',

    'Hybrid Work',
  ];

  // =====================================
  // SUBMIT REQUEST
  // =====================================

  const submitWFH =
    async () => {

    if (

      !wfhType ||
      !startDate ||
      !endDate ||
      !location ||
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

      // ===============================
      // BACKEND READY PAYLOAD
      // ===============================

      const payload = {

        wfh_type:
          wfhType,

        start_date:
          startDate,

        end_date:
          endDate,

        work_location:
          location,

        reason,
      };

      console.log(
        'WFH Payload:',
        payload
      );

      // SUBMIT TO API

      const result =
        await submitWFHRequest(
          payload
        );

      setLoading(false);

      if (result.success) {

        Alert.alert(

          'Success',

          'WFH request submitted successfully'
        );

        navigation.goBack();

      } else {

        Alert.alert(

          'Error',

          result.message ||
          'Failed to submit WFH request'
        );
      }

    } catch (error) {

      console.log(error);

      setLoading(false);

      Alert.alert(
        'Error',
        'WFH request submission failed'
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
          title="Work From Home"
          subtitle="Remote work approval request"
          navigation={navigation}
          showBack
        />

        {/* FORM */}

        <GlassCard>

          {/* HERO */}

          <View style={styles.topSection}>

            <View style={styles.iconBox}>

              <Ionicons
                name="home"
                size={34}
                color="#FFFFFF"
              />

            </View>

            <Text style={styles.title}>
              WFH Request
            </Text>

            <Text style={styles.subtitle}>
              Enterprise remote work workflow
            </Text>

          </View>

          {/* WFH TYPE */}

          <Text style={styles.label}>
            Work Type
          </Text>

          <View style={styles.typeContainer}>

            {
              wfhTypes.map(
                (type, index) => (

                <TouchableOpacity

                  key={index}

                  activeOpacity={0.85}

                  style={[

                    styles.typeButton,

                    wfhType ===
                    type &&

                    styles.activeType,
                  ]}

                  onPress={() =>
                    setWfhType(type)
                  }
                >

                  <Text
                    style={[

                      styles.typeText,

                      wfhType ===
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

          {/* LOCATION */}

          <Text style={styles.label}>
            Work Location
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="location"
              size={20}
              color={COLORS.textMuted}
            />

            <TextInput
              placeholder="Enter remote work location"
              placeholderTextColor={
                COLORS.textMuted
              }
              value={location}
              onChangeText={
                setLocation
              }
              style={styles.input}
            />

          </View>

          {/* REASON */}

          <Text style={styles.label}>
            Reason
          </Text>

          <TextInput
            placeholder="Explain your WFH request..."
            placeholderTextColor={
              COLORS.textMuted
            }
            value={reason}
            onChangeText={setReason}
            multiline
            style={styles.textArea}
          />

          {/* BUTTON */}

          <PrimaryButton

            title="Submit WFH Request"

            onPress={submitWFH}

            loading={loading}

            style={{
              marginTop: 24,
            }}
          />

        </GlassCard>

        {/* POLICY */}

        <GlassCard gradient>

          <Text style={styles.policyTitle}>
            Remote Work Policy
          </Text>

          <PolicyItem
            text="WFH requests require manager approval"
          />

          <PolicyItem
            text="Employees must remain online during work hours"
          />

          <PolicyItem
            text="Daily attendance verification is mandatory"
          />

          <PolicyItem
            text="AI productivity tracking remains active"
          />

          <PolicyItem
            text="Remote access is monitored securely"
          />

          <PolicyItem
            text="Hybrid employees must follow office schedule"
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
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.policyText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  topSection: {

    alignItems: 'center',

    marginBottom: SPACING.xl,
  },

  iconBox: {

    width: 82,

    height: 82,

    borderRadius: 26,

    backgroundColor:
      COLORS.primary,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,

    ...SHADOWS.primary,
  },

  title: {

    color: COLORS.textPrimary,

    fontSize: 28,

    fontWeight: '800',
  },

  subtitle: {

    color: COLORS.textSecondary,

    marginTop: 8,
  },

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

  policyTitle: {

    color: '#FFFFFF',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  policyRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 16,
  },

  policyText: {

    color: '#FFFFFF',

    marginLeft: 12,

    lineHeight: 22,

    flex: 1,
  },

});