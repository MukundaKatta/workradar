import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors as themeColors, typography, radius, spacing } from '@/lib/theme';
import { useStore } from '@/lib/store';
import type { Skill } from '@/lib/store';

interface SkillPillProps {
  skill: Skill;
  compact?: boolean;
}

export default function SkillPill({ skill, compact = false }: SkillPillProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  const colorMap = {
    strong: { bg: c.successLight, text: c.success, dot: c.success },
    partial: { bg: c.warningLight, text: c.warning, dot: c.warning },
    missing: { bg: darkMode ? '#374151' : '#F1F5F9', text: c.textTertiary, dot: c.textTertiary },
  };

  const style = colorMap[skill.match];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: style.bg,
          paddingHorizontal: compact ? spacing.sm : spacing.md,
          paddingVertical: compact ? 3 : spacing.xs,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: style.dot }]} />
      <Text
        style={[
          styles.text,
          {
            color: style.text,
            fontSize: compact ? 11 : 13,
            fontFamily: typography.fontFamily.medium,
          },
        ]}
        numberOfLines={1}
      >
        {skill.name}
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '500',
  },
});
