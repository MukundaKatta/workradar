import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore, type Radar } from '@/lib/store';
import { selectionFeedback } from '@/lib/haptics';

interface RadarCardProps {
  radar: Radar;
  onPress: (radar: Radar) => void;
  onToggle: (id: string) => void;
}

export default function RadarCard({ radar, onPress, onToggle }: RadarCardProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  const handleToggle = async () => {
    await selectionFeedback();
    onToggle(radar.id);
  };

  return (
    <Pressable
      onPress={() => onPress(radar)}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: c.card,
          borderColor: c.cardBorder,
          opacity: pressed ? 0.95 : 1,
          ...shadows.base,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name="radio-outline"
            size={20}
            color={radar.active ? c.primary : c.textTertiary}
          />
          <Text
            style={[styles.name, { color: c.text }]}
            numberOfLines={1}
          >
            {radar.name}
          </Text>
        </View>
        <Switch
          value={radar.active}
          onValueChange={handleToggle}
          trackColor={{ false: c.border, true: c.primary + '60' }}
          thumbColor={radar.active ? c.primary : c.textTertiary}
        />
      </View>

      <Text style={[styles.query, { color: c.textSecondary }]} numberOfLines={2}>
        {radar.query}
      </Text>

      <View style={styles.footer}>
        <View style={[styles.badge, { backgroundColor: c.surface }]}>
          <Text style={[styles.badgeText, { color: c.primary }]}>
            {radar.matchCount} matches
          </Text>
        </View>
        <Text style={[styles.date, { color: c.textTertiary }]}>
          Created {new Date(radar.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.base,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  query: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
  },
});
