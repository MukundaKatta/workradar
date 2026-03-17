import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors as themeColors, typography, radius, spacing } from '@/lib/theme';
import { useStore } from '@/lib/store';

interface SponsorBadgeProps {
  compact?: boolean;
}

export default function SponsorBadge({ compact = false }: SponsorBadgeProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.primaryLight + '1A',
          paddingHorizontal: compact ? spacing.sm : spacing.md,
          paddingVertical: compact ? 2 : spacing.xs,
        },
      ]}
    >
      <Ionicons name="shield-checkmark" size={compact ? 12 : 14} color={c.primary} />
      <Text
        style={[
          styles.text,
          {
            color: c.primary,
            fontSize: compact ? 10 : 12,
            fontFamily: typography.fontFamily.semibold,
          },
        ]}
      >
        H-1B Sponsor
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    gap: 4,
  },
  text: {
    fontWeight: '600',
  },
});
