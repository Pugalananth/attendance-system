import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

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
  SHADOWS,

} from '../../constants/theme';

export default function SalarySlipScreen({
  navigation,
}) {

  // =====================================
  // DOWNLOAD
  // =====================================

  const handleDownload =
    () => {

    Alert.alert(

      'Payroll Export',

      'PDF salary slip export will be connected with backend payroll system.'
    );
  };

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
          title="Salary Slip"
          subtitle="Enterprise payroll dashboard"
          navigation={navigation}
          showBack
        />

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
                Monthly Payroll
              </Text>

              <Text style={styles.heroSub}>
                Salary credited successfully
              </Text>

            </View>

            <Ionicons
              name="wallet"
              size={50}
              color="#FFFFFF"
            />

          </View>

          <View style={styles.heroBottom}>

            <View>

              <Text style={styles.heroValue}>
                ₹45,500
              </Text>

              <Text style={styles.heroLabel}>
                Net Salary
              </Text>

            </View>

            <View>

              <Text style={styles.heroValue}>
                May 2026
              </Text>

              <Text style={styles.heroLabel}>
                Payroll Month
              </Text>

            </View>

          </View>

        </LinearGradient>

        {/* ANALYTICS */}

        <View style={styles.statsRow}>

          <StatsCard
            title="Net Salary"
            value="₹45K"
            icon="wallet"
            colors={
              COLORS.gradientSuccess
            }
          />

          <StatsCard
            title="Bonus"
            value="₹5K"
            icon="cash"
            colors={
              COLORS.gradientPrimary
            }
          />

        </View>

        <View style={styles.statsRow}>

          <StatsCard
            title="Deductions"
            value="₹2.5K"
            icon="remove-circle"
            colors={
              COLORS.gradientDanger
            }
          />

          <StatsCard
            title="Attendance"
            value="96%"
            icon="analytics"
            colors={
              COLORS.gradientSky
            }
          />

        </View>

        {/* PAYROLL INFO */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Payroll Information
          </Text>

          <InfoRow
            icon="business"
            label="Department"
            value="Software Development"
          />

          <InfoRow
            icon="calendar"
            label="Payroll Month"
            value="May 2026"
          />

          <InfoRow
            icon="card"
            label="Payment Method"
            value="Bank Transfer"
          />

          <InfoRow
            icon="checkmark-circle"
            label="Payment Status"
            value="Paid"
            success
          />

        </GlassCard>

        {/* EARNINGS */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Earnings
          </Text>

          <SalaryRow
            label="Basic Salary"
            value="₹35,000"
          />

          <SalaryRow
            label="House Allowance"
            value="₹5,000"
          />

          <SalaryRow
            label="Travel Allowance"
            value="₹3,000"
          />

          <SalaryRow
            label="Performance Bonus"
            value="₹5,000"
          />

          <SalaryRow
            label="Medical Allowance"
            value="₹1,000"
          />

        </GlassCard>

        {/* DEDUCTIONS */}

        <GlassCard>

          <Text style={styles.sectionTitle}>
            Deductions
          </Text>

          <SalaryRow
            label="PF Deduction"
            value="- ₹1,500"
            deduction
          />

          <SalaryRow
            label="Tax Deduction"
            value="- ₹1,000"
            deduction
          />

          <SalaryRow
            label="Insurance"
            value="- ₹500"
            deduction
          />

          <View style={styles.divider} />

          <SalaryRow
            label="Net Salary"
            value="₹45,500"
            highlight
          />

        </GlassCard>

        {/* PAYMENT STATUS */}

        <GlassCard gradient>

          <View style={styles.paymentRow}>

            <View>

              <Text style={styles.paymentTitle}>
                Payment Completed
              </Text>

              <Text style={styles.paymentSubtitle}>
                Enterprise payroll processed successfully
              </Text>

            </View>

            <Ionicons
              name="checkmark-circle"
              size={50}
              color="#00FFB2"
            />

          </View>

        </GlassCard>

        {/* DOWNLOAD */}

        <PrimaryButton
          title="Download Salary Slip PDF"
          onPress={handleDownload}
          style={{
            marginTop: 10,
          }}
        />

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// INFO ROW
// =====================================

function InfoRow({

  icon,
  label,
  value,
  success,

}) {

  return (

    <View style={styles.infoRow}>

      <View style={styles.infoLeft}>

        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.infoLabel}>
          {label}
        </Text>

      </View>

      <Text
        style={[

          styles.infoValue,

          success && {
            color:
              COLORS.success,
          },
        ]}
      >
        {value}
      </Text>

    </View>
  );
}

// =====================================
// SALARY ROW
// =====================================

function SalaryRow({

  label,
  value,
  deduction,
  highlight,

}) {

  return (

    <View style={styles.row}>

      <Text
        style={[

          styles.label,

          highlight && {
            color:
              COLORS.textPrimary,

            fontWeight: '800',
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[

          styles.value,

          deduction && {
            color:
              COLORS.error,
          },

          highlight && {
            color:
              COLORS.success,

            fontWeight: '800',
          },
        ]}
      >
        {value}
      </Text>

    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({

  heroCard: {

    borderRadius: RADIUS['2xl'],

    padding: SPACING.xl,

    marginBottom: SPACING.xl,

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
      'rgba(255,255,255,0.88)',

    marginTop: 6,
  },

  heroBottom: {

    flexDirection: 'row',

    justifyContent: 'space-between',
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

  statsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  sectionTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 22,
  },

  infoRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  infoLeft: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  infoLabel: {

    color: COLORS.textSecondary,

    marginLeft: 12,

    fontSize: FONTS.base,
  },

  infoValue: {

    color: COLORS.textPrimary,

    fontWeight: '700',
  },

  row: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  label: {

    color: COLORS.textSecondary,

    fontSize: FONTS.base,
  },

  value: {

    color: COLORS.textPrimary,

    fontSize: FONTS.base,

    fontWeight: '700',
  },

  divider: {

    height: 1,

    backgroundColor:
      COLORS.border,

    marginVertical: 16,
  },

  paymentRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  paymentTitle: {

    color: '#FFFFFF',

    fontSize: FONTS.lg,

    fontWeight: '800',
  },

  paymentSubtitle: {

    color:
      'rgba(255,255,255,0.9)',

    marginTop: 6,

    lineHeight: 22,
  },

});