import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore, type Application } from '@/lib/store';

interface ApplicationCardProps {
  application: Application;
  onStatusChange: (id: string) => void;
}

const STATUS_CONFIG: Record<
  Application['status'],
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  applied: { label: 'Applied', color: '#3B82F6', icon: 'paper-plane' },
  screening: { label: 'Screening', color: '#8B5CF6', icon: 'eye' },
  interview: { label: 'Interview', color: '#F59E0B', icon: 'chatbubbles' },
  offer: { label: 'Offer', color: '#10B981', icon: 'trophy' },
  rejected: { label: 'Rejected', color: '#EF4444', icon: 'close-circle' },
  withdrawn: { label: 'Withdrawn', color: '#64748B', icon: 'exit' },
};

export default function ApplicationCard({
  application,
  onStatusChange,
}: ApplicationCardProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const [expanded, setExpanded] = useState(false);

  const statusConfig = STATUS_CONFIG[application.status];
  const { job } = application;

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={[
        styles.container,
        {
          backgroundColor: c.card,
          borderColor: c.cardBorder,
          ...shadows.sm,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.jobInfo}>
          <View
            style={[styles.logo, { backgroundColor: c.surface, borderColor: c.border }]}
          >
            <Text style={[styles.logoText, { color: c.primary }]}>
              {job.company.charAt(0)}
            </Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={[styles.company, { color: c.textSecondary }]} numberOfLines={1}>
              {job.company}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => onStatusChange(application.id)}
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.color + '1A' },
          ]}
        >
          <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </Pressable>
      </View>

      {expanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={styles.expandedContent}
        >
          {/* Timeline */}
          <View style={[styles.section, { borderTopColor: c.border }]}>
            <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>
              Timeline
            </Text>
            {application.timeline.map((entry, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View
                  style={[styles.timelineDot, { backgroundColor: c.primary }]}
                />
                <Text style={[styles.timelineDate, { color: c.textTertiary }]}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                <Text style={[styles.timelineEvent, { color: c.text }]}>
                  {entry.event}
                </Text>
              </View>
            ))}
          </View>

          {/* Notes */}
          {application.notes ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: c.textSecondary }]}>
                Notes
              </Text>
              <Text style={[styles.notesText, { color: c.text }]}>
                {application.notes}
              </Text>
            </View>
          ) : null}
        </Animated.View>
      )}

      <View style={styles.footerRow}>
        <Text style={[styles.appliedDate, { color: c.textTertiary }]}>
          Applied {new Date(application.appliedAt).toLocaleDateString()}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={c.textTertiary}
        />
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
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  company: {
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expandedContent: {
    gap: spacing.md,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timelineDate: {
    fontSize: 12,
    width: 80,
  },
  timelineEvent: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedDate: {
    fontSize: 11,
  },
});
