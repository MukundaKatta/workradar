import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MatchCircle from '@/components/MatchCircle';
import SkillPill from '@/components/SkillPill';
import SponsorBadge from '@/components/SponsorBadge';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { successNotification, mediumImpact } from '@/lib/haptics';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const { cards, swipeRight, swipeUp } = useStore();

  const job = cards.find((j) => j.id === id);

  if (!job) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: c.textSecondary }]}>
            Job not found
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.goBack, { color: c.primary }]}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleApply = async () => {
    await successNotification();
    swipeUp(job);
    router.back();
  };

  const handleSave = async () => {
    await mediumImpact();
    swipeRight(job);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this role: ${job.title} at ${job.company}\n\nvia WorkRadar`,
      });
    } catch {}
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.headerBar, { borderBottomColor: c.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={c.text} />
        </Pressable>
        <Pressable onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={22} color={c.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Company Header */}
        <View style={styles.companyHeader}>
          <View style={[styles.companyLogo, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.logoText, { color: c.primary }]}>
              {job.company.charAt(0)}
            </Text>
          </View>
          <View style={styles.companyMeta}>
            <View style={styles.companyNameRow}>
              <Text style={[styles.companyName, { color: c.textSecondary }]}>
                {job.company}
              </Text>
              {job.isH1bSponsor && <SponsorBadge />}
            </View>
            <Text style={[styles.jobTitle, { color: c.text }]}>{job.title}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={14} color={c.textSecondary} />
                <Text style={[styles.metaText, { color: c.textSecondary }]}>
                  {job.location}
                </Text>
              </View>
              {job.salary && (
                <View style={styles.metaChip}>
                  <Ionicons name="cash-outline" size={14} color={c.success} />
                  <Text style={[styles.metaText, { color: c.text }]}>{job.salary}</Text>
                </View>
              )}
              <View style={styles.metaChip}>
                <Ionicons name="laptop-outline" size={14} color={c.textSecondary} />
                <Text style={[styles.metaText, { color: c.textSecondary }]}>
                  {job.remote.charAt(0).toUpperCase() + job.remote.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Match Score */}
        <View style={[styles.matchCard, { backgroundColor: c.surface, borderColor: c.border }]}>
          <MatchCircle score={job.matchScore} size={72} />
          <View style={styles.matchInfo}>
            <Text style={[styles.matchTitle, { color: c.text }]}>
              Why this matches
            </Text>
            <Text style={[styles.matchReason, { color: c.textSecondary }]}>
              {job.matchReason}
            </Text>
          </View>
        </View>

        {/* Skills Analysis */}
        <View style={[styles.section]}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Skills Match</Text>
          <View style={styles.skillsGrid}>
            {job.skills.map((skill) => (
              <SkillPill key={skill.name} skill={skill} />
            ))}
          </View>
          <View style={styles.skillLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: c.success }]} />
              <Text style={[styles.legendText, { color: c.textTertiary }]}>Strong match</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: c.warning }]} />
              <Text style={[styles.legendText, { color: c.textTertiary }]}>Partial</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: c.textTertiary }]} />
              <Text style={[styles.legendText, { color: c.textTertiary }]}>Gap</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>About the Role</Text>
          <Text style={[styles.description, { color: c.textSecondary }]}>
            {job.description}
          </Text>
        </View>

        {/* Company Info */}
        {job.companyInfo && (
          <View style={[styles.companyCard, { backgroundColor: c.surface, borderColor: c.border }]}>
            <Text style={[styles.sectionTitle, { color: c.text }]}>About {job.company}</Text>
            <View style={styles.companyDetails}>
              <View style={styles.companyDetail}>
                <Text style={[styles.detailLabel, { color: c.textTertiary }]}>Industry</Text>
                <Text style={[styles.detailValue, { color: c.text }]}>
                  {job.companyInfo.industry}
                </Text>
              </View>
              <View style={styles.companyDetail}>
                <Text style={[styles.detailLabel, { color: c.textTertiary }]}>Size</Text>
                <Text style={[styles.detailValue, { color: c.text }]}>
                  {job.companyInfo.size}
                </Text>
              </View>
              <View style={styles.companyDetail}>
                <Text style={[styles.detailLabel, { color: c.textTertiary }]}>Founded</Text>
                <Text style={[styles.detailValue, { color: c.text }]}>
                  {job.companyInfo.founded}
                </Text>
              </View>
            </View>
            <Text style={[styles.companyAbout, { color: c.textSecondary }]}>
              {job.companyInfo.about}
            </Text>
          </View>
        )}

        {/* Similar Jobs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Similar Jobs</Text>
          <Text style={[styles.comingSoon, { color: c.textTertiary }]}>
            Similar job recommendations coming soon
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { backgroundColor: c.card, borderTopColor: c.border }]}>
        <Pressable
          onPress={handleSave}
          style={[styles.secondaryButton, { borderColor: c.border }]}
        >
          <Ionicons name="bookmark-outline" size={20} color={c.text} />
          <Text style={[styles.secondaryText, { color: c.text }]}>Save</Text>
        </Pressable>
        <Pressable
          onPress={handleApply}
          style={[styles.applyButton, { backgroundColor: c.primary }]}
        >
          <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
          <Text style={styles.applyText}>Apply Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  notFoundText: {
    fontSize: 16,
  },
  goBack: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.base,
  },
  companyHeader: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.xl,
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
  },
  companyMeta: {
    flex: 1,
    gap: spacing.xs,
  },
  companyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    padding: spacing.base,
    borderRadius: radius.base,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  matchInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  matchTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  matchReason: {
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillLegend: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  companyCard: {
    padding: spacing.base,
    borderRadius: radius.base,
    borderWidth: 1,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  companyDetails: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  companyDetail: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  companyAbout: {
    fontSize: 13,
    lineHeight: 18,
  },
  comingSoon: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
    borderTopWidth: 1,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: radius.base,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
