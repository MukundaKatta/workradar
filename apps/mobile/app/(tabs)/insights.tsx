import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore, type InsightsData } from '@/lib/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MOCK_INSIGHTS: InsightsData = {
  skillGaps: [
    { skill: 'React', current: 90, target: 90 },
    { skill: 'TypeScript', current: 85, target: 90 },
    { skill: 'System Design', current: 60, target: 85 },
    { skill: 'GraphQL', current: 55, target: 75 },
    { skill: 'AWS', current: 45, target: 80 },
    { skill: 'Kubernetes', current: 30, target: 70 },
  ],
  displacementRisk: 28,
  reskillingSuggestions: [
    {
      title: 'System Design Fundamentals',
      provider: 'Educative',
      duration: '6 weeks',
      url: 'https://educative.io',
    },
    {
      title: 'AWS Solutions Architect',
      provider: 'A Cloud Guru',
      duration: '8 weeks',
      url: 'https://acloudguru.com',
    },
    {
      title: 'GraphQL Mastery',
      provider: 'Frontend Masters',
      duration: '4 weeks',
      url: 'https://frontendmasters.com',
    },
    {
      title: 'Kubernetes for Developers',
      provider: 'Linux Foundation',
      duration: '5 weeks',
      url: 'https://training.linuxfoundation.org',
    },
  ],
};

function AnimatedProgressBar({
  current,
  target,
  color,
  bgColor,
}: {
  current: number;
  target: number;
  color: string;
  bgColor: string;
}) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(current, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [current]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={[styles.progressBg, { backgroundColor: bgColor }]}>
      <Animated.View
        style={[styles.progressFill, { backgroundColor: color }, animatedStyle]}
      />
      {/* Target marker */}
      <View
        style={[
          styles.targetMarker,
          { left: `${target}%`, backgroundColor: color + '60' },
        ]}
      />
    </View>
  );
}

export default function InsightsScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const { insights, setInsights } = useStore();

  useEffect(() => {
    if (!insights) {
      setInsights(MOCK_INSIGHTS);
    }
  }, []);

  const data = insights ?? MOCK_INSIGHTS;

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return c.success;
    if (risk <= 60) return c.warning;
    return c.error;
  };

  const riskColor = getRiskColor(data.displacementRisk);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: c.text }]}>Insights</Text>
          <Text style={[styles.headerSubtitle, { color: c.textSecondary }]}>
            AI-powered career intelligence
          </Text>
        </View>

        {/* AI Displacement Risk */}
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.cardBorder, ...shadows.base }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="shield-outline" size={20} color={riskColor} />
              <Text style={[styles.cardTitle, { color: c.text }]}>
                AI Displacement Risk
              </Text>
            </View>
          </View>

          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeCircle}>
              <Text style={[styles.gaugeValue, { color: riskColor }]}>
                {data.displacementRisk}%
              </Text>
              <Text style={[styles.gaugeLabel, { color: c.textSecondary }]}>
                Low Risk
              </Text>
            </View>

            <View style={[styles.riskBar, { backgroundColor: c.surface }]}>
              <View
                style={[
                  styles.riskFill,
                  {
                    backgroundColor: riskColor,
                    width: `${data.displacementRisk}%`,
                  },
                ]}
              />
            </View>

            <Text style={[styles.riskExplainer, { color: c.textSecondary }]}>
              Your current skill set is well-positioned against AI automation.
              Focus on system design and cloud skills to stay ahead.
            </Text>
          </View>
        </View>

        {/* Skill Gap Analysis */}
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.cardBorder, ...shadows.base }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="bar-chart-outline" size={20} color={c.primary} />
              <Text style={[styles.cardTitle, { color: c.text }]}>
                Skill Gap Analysis
              </Text>
            </View>
          </View>

          <View style={styles.skillGaps}>
            {data.skillGaps.map((skill) => {
              const gap = skill.target - skill.current;
              const barColor =
                gap <= 0 ? c.success : gap <= 20 ? c.warning : c.error;

              return (
                <View key={skill.skill} style={styles.skillRow}>
                  <View style={styles.skillLabelRow}>
                    <Text style={[styles.skillName, { color: c.text }]}>
                      {skill.skill}
                    </Text>
                    <Text style={[styles.skillPercent, { color: c.textSecondary }]}>
                      {skill.current}%
                      {gap > 0 && (
                        <Text style={{ color: barColor }}> ({gap}% gap)</Text>
                      )}
                    </Text>
                  </View>
                  <AnimatedProgressBar
                    current={skill.current}
                    target={skill.target}
                    color={barColor}
                    bgColor={c.surface}
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Reskilling Suggestions */}
        <View style={styles.sectionHeader}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="school-outline" size={20} color={c.primary} />
            <Text style={[styles.cardTitle, { color: c.text }]}>
              Recommended Courses
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesScroll}
        >
          {data.reskillingSuggestions.map((course, idx) => (
            <Pressable
              key={idx}
              style={[
                styles.courseCard,
                { backgroundColor: c.card, borderColor: c.cardBorder, ...shadows.sm },
              ]}
            >
              <View
                style={[styles.courseIcon, { backgroundColor: c.primary + '1A' }]}
              >
                <Ionicons name="book-outline" size={24} color={c.primary} />
              </View>
              <Text style={[styles.courseTitle, { color: c.text }]} numberOfLines={2}>
                {course.title}
              </Text>
              <Text style={[styles.courseProvider, { color: c.textSecondary }]}>
                {course.provider}
              </Text>
              <View style={styles.courseMeta}>
                <Ionicons name="time-outline" size={12} color={c.textTertiary} />
                <Text style={[styles.courseDuration, { color: c.textTertiary }]}>
                  {course.duration}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* AI Coach CTA */}
        <Pressable
          onPress={() => router.push('/chat')}
          style={[styles.coachCta, { backgroundColor: c.primary }]}
        >
          <View style={styles.coachContent}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF" />
            <View style={styles.coachText}>
              <Text style={styles.coachTitle}>Ask AI Career Coach</Text>
              <Text style={styles.coachSubtitle}>
                Get personalized career advice based on your profile
              </Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    borderRadius: radius.base,
    borderWidth: 1,
    padding: spacing.base,
  },
  cardHeader: {
    marginBottom: spacing.base,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  gaugeContainer: {
    alignItems: 'center',
    gap: spacing.base,
  },
  gaugeCircle: {
    alignItems: 'center',
  },
  gaugeValue: {
    fontSize: 36,
    fontWeight: '800',
  },
  gaugeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  riskBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  riskFill: {
    height: '100%',
    borderRadius: 4,
  },
  riskExplainer: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  skillGaps: {
    gap: spacing.base,
  },
  skillRow: {
    gap: spacing.xs,
  },
  skillLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillPercent: {
    fontSize: 13,
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  targetMarker: {
    position: 'absolute',
    top: -2,
    width: 3,
    height: 12,
    borderRadius: 1.5,
    marginLeft: -1.5,
  },
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  coursesScroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  courseCard: {
    width: SCREEN_WIDTH * 0.55,
    borderRadius: radius.base,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
    marginRight: spacing.md,
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  courseProvider: {
    fontSize: 13,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseDuration: {
    fontSize: 12,
  },
  coachCta: {
    marginHorizontal: spacing.base,
    marginTop: spacing.lg,
    borderRadius: radius.base,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coachContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  coachText: {
    flex: 1,
  },
  coachTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  coachSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
});
