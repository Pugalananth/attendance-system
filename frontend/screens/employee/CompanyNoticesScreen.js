import React from 'react';

import {
  View,
  Text,
  StyleSheet,
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

export default function CompanyNoticesScreen({
  navigation,
}) {

  // =====================================
  // NOTICES
  // =====================================

  const notices = [

    {
      id: 1,
      icon: 'megaphone',
      color: COLORS.primary,
      priority: 'HIGH',
      category: 'Meeting',
      title: 'Monthly Company Meeting',
      date: '26 May 2026',
      description:
        'All employees must attend the monthly company meeting at 10:00 AM in the main conference hall.',
    },

    {
      id: 2,
      icon: 'calendar',
      color: COLORS.warning,
      priority: 'MEDIUM',
      category: 'Holiday',
      title: 'Public Holiday Notice',
      date: '01 June 2026',
      description:
        'Office will remain closed due to national holiday. Attendance will not be marked.',
    },

    {
      id: 3,
      icon: 'shield-checkmark',
      color: COLORS.success,
      priority: 'IMPORTANT',
      category: 'Security',
      title: 'AI Attendance Upgrade',
      date: '20 May 2026',
      description:
        'New AI liveness verification has been enabled for secure attendance tracking.',
    },

    {
      id: 4,
      icon: 'construct',
      color: COLORS.error,
      priority: 'CRITICAL',
      category: 'Maintenance',
      title: 'Server Maintenance',
      date: '28 May 2026',
      description:
        'Attendance services may be temporarily unavailable between 11 PM and 1 AM.',
    },

    {
      id: 5,
      icon: 'cloud-upload',
      color: '#7C5CFF',
      priority: 'UPDATE',
      category: 'System',
      title: 'Cloud Synchronization Active',
      date: '18 May 2026',
      description:
        'Employee attendance data is now synchronized in real-time across all departments.',
    },
  ];

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
          title="Company Notices"
          subtitle="Enterprise announcement center"
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
                Enterprise Notice Board
              </Text>

              <Text style={styles.heroSub}>
                HR & Admin announcements
              </Text>

            </View>

            <Ionicons
              name="notifications"
              size={48}
              color="#FFFFFF"
            />

          </View>

          <View style={styles.heroStats}>

            <View>

              <Text style={styles.heroValue}>
                05
              </Text>

              <Text style={styles.heroLabel}>
                Active Notices
              </Text>

            </View>

            <View>

              <Text style={styles.heroValue}>
                24/7
              </Text>

              <Text style={styles.heroLabel}>
                Live Updates
              </Text>

            </View>

          </View>

        </LinearGradient>

        {/* SECTION */}

        <Text style={styles.sectionTitle}>
          Latest Announcements
        </Text>

        {/* NOTICES */}

        {
          notices.map((item) => (

            <NoticeCard
              key={item.id}
              item={item}
            />
          ))
        }

      </ScrollView>

    </ScreenContainer>
  );
}

// =====================================
// NOTICE CARD
// =====================================

function NoticeCard({
  item,
}) {

  return (

    <GlassCard>

      {/* TOP */}

      <View style={styles.topRow}>

        <View style={styles.leftTop}>

          <View
            style={[

              styles.iconBox,

              {
                backgroundColor:
                  item.color,
              },
            ]}
          >

            <Ionicons
              name={item.icon}
              size={22}
              color="#FFFFFF"
            />

          </View>

          <View>

            <Text style={styles.category}>
              {item.category}
            </Text>

            <Text style={styles.date}>
              {item.date}
            </Text>

          </View>

        </View>

        {/* PRIORITY */}

        <View
          style={[
            styles.priorityBadge,

            {
              backgroundColor:
                `${item.color}22`,
            },
          ]}
        >

          <Text
            style={[
              styles.priorityText,

              {
                color:
                  item.color,
              },
            ]}
          >
            {item.priority}
          </Text>

        </View>

      </View>

      {/* TITLE */}

      <Text style={styles.title}>
        {item.title}
      </Text>

      {/* DESCRIPTION */}

      <Text style={styles.description}>
        {item.description}
      </Text>

      {/* FOOTER */}

      <View style={styles.footer}>

        <View style={styles.footerRow}>

          <Ionicons
            name="business"
            size={16}
            color={COLORS.textMuted}
          />

          <Text style={styles.footerText}>
            HR Department
          </Text>

        </View>

        <View style={styles.footerRow}>

          <Ionicons
            name="time"
            size={16}
            color={COLORS.textMuted}
          />

          <Text style={styles.footerText}>
            Live Notice
          </Text>

        </View>

      </View>

    </GlassCard>
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

    marginBottom: SPACING.xl,
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

    color: COLORS.textPrimary,

    fontSize: FONTS.lg,

    fontWeight: '800',

    marginBottom: 20,
  },

  topRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 18,
  },

  leftTop: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  iconBox: {

    width: 56,

    height: 56,

    borderRadius: 18,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 16,
  },

  category: {

    color: COLORS.textPrimary,

    fontWeight: '700',

    fontSize: 15,
  },

  date: {

    color: COLORS.textMuted,

    marginTop: 4,

    fontSize: 12,
  },

  priorityBadge: {

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 14,
  },

  priorityText: {

    fontWeight: '700',

    fontSize: 12,
  },

  title: {

    color: COLORS.textPrimary,

    fontSize: 20,

    fontWeight: '800',

    marginBottom: 14,
  },

  description: {

    color: COLORS.textSecondary,

    lineHeight: 24,

    fontSize: FONTS.base,
  },

  footer: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 24,

    borderTopWidth: 1,

    borderTopColor: COLORS.border,

    paddingTop: 16,
  },

  footerRow: {

    flexDirection: 'row',

    alignItems: 'center',
  },

  footerText: {

    color: COLORS.textMuted,

    marginLeft: 8,

    fontSize: 12,
  },

});