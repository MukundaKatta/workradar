import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { selectionFeedback, mediumImpact } from '@/lib/haptics';

interface SectionItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  type?: 'nav' | 'toggle';
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const {
    user,
    onboardingData,
    darkMode: isDark,
    setDarkMode,
    biometricEnabled,
    setBiometric,
    notificationsEnabled,
    setNotifications,
    logout,
  } = useStore();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await mediumImpact();
          await supabase.auth.signOut();
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login',
      });
      if (success) {
        setBiometric(true);
        await selectionFeedback();
      }
    } else {
      setBiometric(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
    selectionFeedback();
  };

  const profileSections: { title: string; key: string; items: SectionItem[] }[] = [
    {
      title: 'Job Preferences',
      key: 'prefs',
      items: [
        {
          icon: 'briefcase-outline',
          label: 'Target Role',
          value: onboardingData.role || 'Not set',
        },
        {
          icon: 'trending-up-outline',
          label: 'Seniority',
          value: onboardingData.seniority || 'Not set',
        },
        {
          icon: 'cash-outline',
          label: 'Salary Range',
          value:
            onboardingData.salaryMin && onboardingData.salaryMax
              ? `$${(onboardingData.salaryMin / 1000).toFixed(0)}K - $${(onboardingData.salaryMax / 1000).toFixed(0)}K`
              : 'Not set',
        },
        {
          icon: 'home-outline',
          label: 'Remote Preference',
          value: onboardingData.remotePreference || 'Any',
        },
      ],
    },
    {
      title: 'Skills',
      key: 'skills',
      items:
        onboardingData.skills?.map((skill) => ({
          icon: 'code-slash-outline' as keyof typeof Ionicons.glyphMap,
          label: skill,
        })) || [],
    },
    {
      title: 'Visa Information',
      key: 'visa',
      items: [
        {
          icon: 'shield-checkmark-outline',
          label: 'Visa Required',
          value: onboardingData.visaRequired ? 'Yes' : 'No',
        },
        ...(onboardingData.visaType
          ? [
              {
                icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
                label: 'Visa Type',
                value: onboardingData.visaType,
              },
            ]
          : []),
      ],
    },
  ];

  const settingsItems: SectionItem[] = [
    {
      icon: 'moon-outline',
      label: 'Dark Mode',
      type: 'toggle',
      toggleValue: isDark,
      onToggle: (v) => {
        setDarkMode(v);
        selectionFeedback();
      },
    },
    {
      icon: 'finger-print-outline',
      label: 'Biometric Login',
      type: 'toggle',
      toggleValue: biometricEnabled,
      onToggle: handleBiometricToggle,
    },
    {
      icon: 'notifications-outline',
      label: 'Push Notifications',
      type: 'toggle',
      toggleValue: notificationsEnabled,
      onToggle: (v) => {
        setNotifications(v);
        selectionFeedback();
      },
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: c.text }]}>Profile</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: c.primary }]}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'W'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: c.text }]}>
            {user?.name || 'WorkRadar User'}
          </Text>
          <Text style={[styles.userEmail, { color: c.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
          {onboardingData.role && (
            <Text style={[styles.userHeadline, { color: c.textTertiary }]}>
              {onboardingData.seniority} {onboardingData.role}
            </Text>
          )}
        </View>

        {/* Profile Sections */}
        {profileSections.map((section) => (
          <View key={section.key} style={styles.sectionContainer}>
            <Pressable
              onPress={() => toggleSection(section.key)}
              style={[styles.sectionHeader, { borderBottomColor: c.border }]}
            >
              <Text style={[styles.sectionTitle, { color: c.text }]}>
                {section.title}
              </Text>
              <Ionicons
                name={expandedSection === section.key ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={c.textTertiary}
              />
            </Pressable>

            {expandedSection === section.key && (
              <View style={styles.sectionContent}>
                {section.items.length === 0 ? (
                  <Text style={[styles.emptyText, { color: c.textTertiary }]}>
                    No data added yet
                  </Text>
                ) : (
                  section.items.map((item, idx) => (
                    <View
                      key={idx}
                      style={[styles.settingRow, { borderBottomColor: c.borderLight }]}
                    >
                      <View style={styles.settingLeft}>
                        <Ionicons name={item.icon} size={20} color={c.textSecondary} />
                        <Text style={[styles.settingLabel, { color: c.text }]}>
                          {item.label}
                        </Text>
                      </View>
                      {item.value && (
                        <Text style={[styles.settingValue, { color: c.textSecondary }]}>
                          {item.value}
                        </Text>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        ))}

        {/* Settings */}
        <View style={styles.sectionContainer}>
          <View style={[styles.sectionHeader, { borderBottomColor: c.border }]}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>Settings</Text>
          </View>
          <View style={styles.sectionContent}>
            {settingsItems.map((item, idx) => (
              <View
                key={idx}
                style={[styles.settingRow, { borderBottomColor: c.borderLight }]}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon} size={20} color={c.textSecondary} />
                  <Text style={[styles.settingLabel, { color: c.text }]}>
                    {item.label}
                  </Text>
                </View>
                {item.type === 'toggle' && (
                  <Switch
                    value={item.toggleValue}
                    onValueChange={item.onToggle}
                    trackColor={{ false: c.border, true: c.primary + '60' }}
                    thumbColor={item.toggleValue ? c.primary : c.textTertiary}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={handleSignOut}
          style={[styles.signOutButton, { borderColor: c.error }]}
        >
          <Ionicons name="log-out-outline" size={20} color={c.error} />
          <Text style={[styles.signOutText, { color: c.error }]}>Sign Out</Text>
        </Pressable>

        <View style={{ height: spacing['4xl'] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
  },
  userHeadline: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  sectionContainer: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionContent: {
    paddingTop: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    paddingVertical: spacing.md,
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
