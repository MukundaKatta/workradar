import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { colors as themeColors, typography, spacing } from '@/lib/theme';
import { useStore } from '@/lib/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingStepProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function OnboardingStep({
  title,
  subtitle,
  children,
}: OnboardingStepProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['4xl'],
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  content: {
    gap: spacing.base,
  },
});
