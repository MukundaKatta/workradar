import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import MatchCircle from './MatchCircle';
import SkillPill from './SkillPill';
import SponsorBadge from './SponsorBadge';
import { colors as themeColors, typography, radius, spacing, shadows } from '@/lib/theme';
import { useStore, type Job } from '@/lib/store';
import { mediumImpact, successNotification } from '@/lib/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const SWIPE_UP_THRESHOLD = 120;

interface JobCardProps {
  job: Job;
  onSwipeRight: (job: Job) => void;
  onSwipeLeft: (job: Job) => void;
  onSwipeUp: (job: Job) => void;
  onPress: (job: Job) => void;
}

export default function JobCard({
  job,
  onSwipeRight,
  onSwipeLeft,
  onSwipeUp,
  onPress,
}: JobCardProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = Math.min(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(successNotification)();
        runOnJS(onSwipeRight)(job);
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(mediumImpact)();
        runOnJS(onSwipeLeft)(job);
      } else if (e.translationY < -SWIPE_UP_THRESHOLD) {
        translateY.value = withTiming(-SCREEN_WIDTH * 2, { duration: 300 });
        runOnJS(successNotification)();
        runOnJS(onSwipeUp)(job);
      } else {
        translateX.value = withSpring(0, { damping: 20 });
        translateY.value = withSpring(0, { damping: 20 });
      }
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onPress)(job);
  });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const nopeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const applyOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, -SWIPE_UP_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const topSkills = job.skills.slice(0, 4);
  const timeSince = getTimeSince(job.postedAt);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: c.card,
            borderColor: c.cardBorder,
            ...shadows.lg,
          },
          animatedStyle,
        ]}
      >
        {/* Swipe Overlays */}
        <Animated.View style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]}>
          <Text style={styles.overlayText}>SAVE</Text>
        </Animated.View>
        <Animated.View style={[styles.overlay, styles.nopeOverlay, nopeOverlayStyle]}>
          <Text style={[styles.overlayText, { color: '#EF4444' }]}>PASS</Text>
        </Animated.View>
        <Animated.View style={[styles.overlay, styles.applyOverlay, applyOverlayStyle]}>
          <Text style={[styles.overlayText, { color: '#2563EB' }]}>APPLY</Text>
        </Animated.View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyRow}>
            <View
              style={[
                styles.companyLogo,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <Text style={[styles.logoText, { color: c.primary }]}>
                {job.company.charAt(0)}
              </Text>
            </View>
            <View style={styles.companyInfo}>
              <View style={styles.companyNameRow}>
                <Text
                  style={[styles.companyName, { color: c.textSecondary }]}
                  numberOfLines={1}
                >
                  {job.company}
                </Text>
                {job.isH1bSponsor && <SponsorBadge compact />}
              </View>
              <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>
                {job.title}
              </Text>
            </View>
            <MatchCircle score={job.matchScore} size={56} />
          </View>
        </View>

        {/* Match Reason */}
        <View style={[styles.matchReasonContainer, { backgroundColor: c.surface }]}>
          <Ionicons name="sparkles" size={14} color={c.primary} />
          <Text
            style={[styles.matchReason, { color: c.textSecondary }]}
            numberOfLines={2}
          >
            {job.matchReason}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.detailsRow}>
          {job.salary && (
            <View style={styles.detailChip}>
              <Ionicons name="cash-outline" size={14} color={c.success} />
              <Text style={[styles.detailText, { color: c.text }]}>{job.salary}</Text>
            </View>
          )}
          <View style={styles.detailChip}>
            <Ionicons name="location-outline" size={14} color={c.textSecondary} />
            <Text style={[styles.detailText, { color: c.text }]}>{job.location}</Text>
          </View>
          <View style={styles.detailChip}>
            <Ionicons name="time-outline" size={14} color={c.textSecondary} />
            <Text style={[styles.detailText, { color: c.textSecondary }]}>{timeSince}</Text>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.skillsRow}>
          {topSkills.map((skill) => (
            <SkillPill key={skill.name} skill={skill} />
          ))}
          {job.skills.length > 4 && (
            <Text style={[styles.moreSkills, { color: c.textTertiary }]}>
              +{job.skills.length - 4}
            </Text>
          )}
        </View>

        {/* Footer Hints */}
        <View style={styles.footer}>
          <View style={styles.hintRow}>
            <View style={styles.hint}>
              <Ionicons name="arrow-back" size={12} color={c.textTertiary} />
              <Text style={[styles.hintText, { color: c.textTertiary }]}>Pass</Text>
            </View>
            <View style={styles.hint}>
              <Ionicons name="arrow-up" size={12} color={c.primary} />
              <Text style={[styles.hintText, { color: c.textTertiary }]}>Apply</Text>
            </View>
            <View style={styles.hint}>
              <Ionicons name="arrow-forward" size={12} color={c.success} />
              <Text style={[styles.hintText, { color: c.textTertiary }]}>Save</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

function getTimeSince(dateString: string): string {
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.base,
    position: 'absolute',
    alignSelf: 'center',
  },
  overlay: {
    position: 'absolute',
    top: spacing.lg,
    zIndex: 10,
    borderWidth: 3,
    borderRadius: radius.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  likeOverlay: {
    right: spacing.lg,
    borderColor: '#10B981',
    transform: [{ rotate: '-15deg' }],
  },
  nopeOverlay: {
    left: spacing.lg,
    borderColor: '#EF4444',
    transform: [{ rotate: '15deg' }],
  },
  applyOverlay: {
    alignSelf: 'center',
    left: '35%',
    borderColor: '#2563EB',
  },
  overlayText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 2,
  },
  header: {},
  companyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.base,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
  },
  companyInfo: {
    flex: 1,
    gap: 2,
  },
  companyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  matchReasonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.base,
  },
  matchReason: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  moreSkills: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hintText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
