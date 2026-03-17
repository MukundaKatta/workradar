import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import JobCard from '@/components/JobCard';
import { colors as themeColors, typography, spacing, radius } from '@/lib/theme';
import { useStore, type Job } from '@/lib/store';
import { successNotification, mediumImpact } from '@/lib/haptics';

// Mock data for demonstration
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'Stripe',
    companyLogo: undefined,
    location: 'San Francisco, CA',
    salary: '$180K - $250K',
    matchScore: 92,
    matchReason: 'Strong match: React/TypeScript skills, salary range, and remote preference align perfectly.',
    skills: [
      { name: 'React', match: 'strong' },
      { name: 'TypeScript', match: 'strong' },
      { name: 'GraphQL', match: 'partial' },
      { name: 'Node.js', match: 'strong' },
      { name: 'AWS', match: 'partial' },
    ],
    postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    isH1bSponsor: true,
    remote: 'hybrid',
    description: 'Join our team building the next generation of financial infrastructure...',
  },
  {
    id: '2',
    title: 'Staff Software Engineer',
    company: 'Vercel',
    location: 'Remote',
    salary: '$200K - $280K',
    matchScore: 87,
    matchReason: 'Great fit: Full-stack skills match, remote-first culture, and strong compensation.',
    skills: [
      { name: 'Next.js', match: 'strong' },
      { name: 'TypeScript', match: 'strong' },
      { name: 'Rust', match: 'missing' },
      { name: 'Node.js', match: 'strong' },
    ],
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    isH1bSponsor: true,
    remote: 'remote',
    description: 'Help us build the future of web development...',
  },
  {
    id: '3',
    title: 'ML Platform Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    salary: '$250K - $370K',
    matchScore: 74,
    matchReason: 'Partial match: Strong Python skills but missing ML infrastructure experience.',
    skills: [
      { name: 'Python', match: 'strong' },
      { name: 'Kubernetes', match: 'partial' },
      { name: 'PyTorch', match: 'missing' },
      { name: 'Go', match: 'missing' },
      { name: 'Docker', match: 'strong' },
    ],
    postedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    isH1bSponsor: true,
    remote: 'onsite',
    description: 'Build the infrastructure powering AI research...',
  },
  {
    id: '4',
    title: 'Product Engineer',
    company: 'Linear',
    location: 'Remote (US)',
    salary: '$160K - $220K',
    matchScore: 81,
    matchReason: 'Good match: Product mindset and React skills align. Company culture matches preferences.',
    skills: [
      { name: 'React', match: 'strong' },
      { name: 'TypeScript', match: 'strong' },
      { name: 'PostgreSQL', match: 'partial' },
    ],
    postedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    isH1bSponsor: false,
    remote: 'remote',
    description: 'Build the best project management tool for software teams...',
  },
];

export default function DiscoverScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const { cards, currentIndex, setCards, swipeRight, swipeLeft, swipeUp } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (cards.length === 0) {
      setCards(MOCK_JOBS);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCards(MOCK_JOBS);
    setRefreshing(false);
  }, []);

  const handleSwipeRight = useCallback((job: Job) => {
    swipeRight(job);
  }, []);

  const handleSwipeLeft = useCallback((job: Job) => {
    swipeLeft(job);
  }, []);

  const handleSwipeUp = useCallback((job: Job) => {
    swipeUp(job);
  }, []);

  const handlePress = useCallback((job: Job) => {
    router.push(`/job/${job.id}`);
  }, []);

  const visibleCards = cards.slice(currentIndex, currentIndex + 3);
  const isExhausted = currentIndex >= cards.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: c.text }]}>Discover</Text>
          <Text style={[styles.headerSubtitle, { color: c.textSecondary }]}>
            {cards.length - currentIndex} jobs to review
          </Text>
        </View>
        <Pressable style={[styles.filterButton, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Ionicons name="options-outline" size={20} color={c.textSecondary} />
        </Pressable>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {isExhausted ? (
          <ScrollView
            contentContainerStyle={styles.emptyContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} />
            }
          >
            <Ionicons name="checkmark-circle-outline" size={64} color={c.primary} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>All caught up!</Text>
            <Text style={[styles.emptySubtitle, { color: c.textSecondary }]}>
              Pull to refresh for new matches
            </Text>
          </ScrollView>
        ) : (
          visibleCards
            .reverse()
            .map((job, idx) => (
              <JobCard
                key={job.id}
                job={job}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                onSwipeUp={handleSwipeUp}
                onPress={handlePress}
              />
            ))
        )}
      </View>

      {/* Action Buttons */}
      {!isExhausted && (
        <View style={styles.actions}>
          <Pressable
            onPress={() => {
              const job = cards[currentIndex];
              if (job) {
                mediumImpact();
                handleSwipeLeft(job);
              }
            }}
            style={[styles.actionButton, { backgroundColor: c.errorLight }]}
          >
            <Ionicons name="close" size={28} color={c.error} />
          </Pressable>
          <Pressable
            onPress={() => {
              const job = cards[currentIndex];
              if (job) {
                successNotification();
                handleSwipeUp(job);
              }
            }}
            style={[styles.actionButton, styles.applyButton, { backgroundColor: c.primary + '1A' }]}
          >
            <Ionicons name="paper-plane" size={24} color={c.primary} />
            <Text style={[styles.applyLabel, { color: c.primary }]}>Apply</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              const job = cards[currentIndex];
              if (job) {
                successNotification();
                handleSwipeRight(job);
              }
            }}
            style={[styles.actionButton, { backgroundColor: c.successLight }]}
          >
            <Ionicons name="bookmark" size={28} color={c.success} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: radius.base,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.sm,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    width: 'auto',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
  },
  applyLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
