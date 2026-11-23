import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
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

import {

  COLORS,
  FONTS,
  SPACING,
  RADIUS,
  SHADOWS,

} from '../../constants/theme';

export default function HelpSupportScreen({
  navigation,
}) {

  // =====================================
  // SUPPORT ACTION
  // =====================================

  const handleSupport =
    (title) => {

    Alert.alert(

      title,

      'Enterprise support request system will be connected to backend workflow.'
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
          title="Help & Support"
          subtitle="Enterprise employee support center"
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

          <View style={styles.topSection}>

            <View style={styles.iconBox}>

              <Ionicons
                name="headset"
                size={38}
                color="#FFFFFF"
              />

            </View>

            <Text style={styles.title}>
              Enterprise Support
            </Text>

            <Text style={styles.subtitle}>
              HR, technical and security assistance
            </Text>

          </View>

          {/* STATS */}

          <View style={styles.statsRow}>

            <StatItem
              value="24/7"
              label="Support"
            />

            <StatItem
              value="<5m"
              label="Response"
            />

            <StatItem
              value="99%"
              label="Resolution"
            />

          </View>

        </LinearGradient>

        {/* SUPPORT SECTION */}

        <Text style={styles.sectionTitle}>
          Support Categories
        </Text>

        {/* HR */}

        <SupportCard
          icon="person"
          title="HR Support"
          subtitle="Leave, payroll and employee issues"
          priority="NORMAL"
          color={COLORS.primary}
          onPress={() =>
            handleSupport(
              'HR Support'
            )
          }
        />

        {/* TECH */}

        <SupportCard
          icon="settings"
          title="Technical Support"
          subtitle="App issues and attendance problems"
          priority="HIGH"
          color={COLORS.warning}
          onPress={() =>
            handleSupport(
              'Technical Support'
            )
          }
        />

        {/* SECURITY */}

        <SupportCard
          icon="shield-checkmark"
          title="Security Support"
          subtitle="Face verification and security assistance"
          priority="CRITICAL"
          color={COLORS.success}
          onPress={() =>
            handleSupport(
              'Security Support'
            )
          }
        />

        {/* EMERGENCY */}

        <SupportCard
          icon="call"
          title="Emergency Contact"
          subtitle="+91 9876543210"
          priority="URGENT"
          color={COLORS.error}
          onPress={() =>
            handleSupport(
              'Emergency Contact'
            )
          }
        />

        {/* FAQ */}

        <GlassCard>

          <Text style={styles.faqTitle}>
            Frequently Asked Questions
          </Text>

          <FAQItem
            question="How to mark attendance?"
            answer="Open Face Attendance screen and complete AI verification."
          />

          <FAQItem
            question="How to request leave?"
            answer="Use Leave Request module and wait for HR approval."
          />

          <FAQItem
            question="How to reset face verification?"
            answer="Contact Security Support for biometric reset approval."
          />

          <FAQItem
            question="How to download salary slip?"
            answer="Open Salary Slip module and export monthly payroll PDF."
          />

        </GlassCard>

        {/* SECURITY */}

        <GlassCard gradient>

          <Text style={styles.securityTitle}>
            Enterprise Security Support
          </Text>

          <SecurityRow
            text="AI attendance protection active"
          />

          <SecurityRow
            text="Biometric verification monitored"
          />

          <SecurityRow
            text="Secure employee authentication enabled"
          />

          <SecurityRow
            text="Remote support ticket encryption active"
          />

        </GlassCard>

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// SUPPORT CARD
// =====================================

function SupportCard({

  icon,
  title,
  subtitle,
  priority,
  color,
  onPress,

}) {

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
    >

      <GlassCard>

        <View style={styles.cardRow}>

          {/* LEFT */}

          <View style={styles.leftCard}>

            <View
              style={[

                styles.cardIcon,

                {
                  backgroundColor:
                    color,
                },
              ]}
            >

              <Ionicons
                name={icon}
                size={24}
                color="#FFFFFF"
              />

            </View>

            <View style={{ flex: 1 }}>

              <Text style={styles.cardTitle}>
                {title}
              </Text>

              <Text
                style={styles.cardSubtitle}
              >
                {subtitle}
              </Text>

            </View>

          </View>

          {/* RIGHT */}

          <View
            style={[

              styles.priorityBadge,

              {
                backgroundColor:
                  `${color}22`,
              },
            ]}
          >

            <Text
              style={[

                styles.priorityText,

                {
                  color:
                    color,
                },
              ]}
            >
              {priority}
            </Text>

          </View>

        </View>

      </GlassCard>

    </TouchableOpacity>
  );
}

// =====================================
// FAQ ITEM
// =====================================

function FAQItem({

  question,
  answer,

}) {

  return (

    <View style={styles.faqItem}>

      <View style={styles.faqRow}>

        <Ionicons
          name="help-circle"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.faqQuestion}>
          {question}
        </Text>

      </View>

      <Text style={styles.faqAnswer}>
        {answer}
      </Text>

    </View>
  );
}

// =====================================
// SECURITY ROW
// =====================================

function SecurityRow({
  text,
}) {

  return (

    <View style={styles.securityRow}>

      <Ionicons
        name="shield-checkmark"
        size={20}
        color="#00FFB2"
      />

      <Text style={styles.securityText}>
        {text}
      </Text>

    </View>
  );
}

// =====================================
// STATS
// =====================================

function StatItem({
  value,
  label,
}) {

  return (

    <View style={styles.statItem}>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
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

  topSection: {

    alignItems: 'center',

    marginBottom: 28,
  },

  iconBox: {

    width: 90,

    height: 90,

    borderRadius: 30,

    backgroundColor:
      'rgba(255,255,255,0.18)',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 20,
  },

  title: {

    color: '#FFFFFF',

    fontSize: 30,

    fontWeight: '800',
  },

  subtitle: {

    color:
      'rgba(255,255,255,0.92)',

    marginTop: 10,

    textAlign: 'center',

    lineHeight: 24,
  },

  statsRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',
  },

  statItem: {

    alignItems: 'center',
  },

  statValue: {

    color: '#FFFFFF',

    fontSize: 28,

    fontWeight: '800',
  },

  statLabel: {

    color:
      'rgba(255,255,255,0.82)',

    marginTop: 6,
  },

  sectionTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  cardRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  leftCard: {

    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  cardIcon: {

    width: 58,

    height: 58,

    borderRadius: 18,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  cardTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.base,

    fontWeight: '800',
  },

  cardSubtitle: {

    color: COLORS.textSecondary,

    marginTop: 5,

    lineHeight: 20,
  },

  priorityBadge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 14,
  },

  priorityText: {

    fontWeight: '700',

    fontSize: 11,
  },

  faqTitle: {

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 24,
  },

  faqItem: {

    marginBottom: 22,

    borderBottomWidth: 1,

    borderBottomColor:
      COLORS.border,

    paddingBottom: 18,
  },

  faqRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 10,
  },

  faqQuestion: {

    color: COLORS.textPrimary,

    marginLeft: 12,

    fontWeight: '700',

    flex: 1,
  },

  faqAnswer: {

    color: COLORS.textSecondary,

    lineHeight: 22,

    marginLeft: 32,
  },

  securityTitle: {

    color: '#FFFFFF',

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 22,
  },

  securityRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 18,
  },

  securityText: {

    color: '#FFFFFF',

    marginLeft: 12,

    flex: 1,

    lineHeight: 22,
  },

});