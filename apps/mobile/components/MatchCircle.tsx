import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors as themeColors, typography } from '@/lib/theme';
import { useStore } from '@/lib/store';

interface MatchCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function MatchCircle({
  score,
  size = 64,
  strokeWidth = 4,
  showLabel = true,
}: MatchCircleProps) {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const getColor = () => {
    if (score >= 80) return c.success;
    if (score >= 60) return c.warning;
    return c.error;
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedStyle = useAnimatedStyle(() => {
    const strokeDashoffset = interpolate(
      progress.value,
      [0, 1],
      [circumference, 0]
    );
    return {
      transform: [{ rotate: '-90deg' }],
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: c.border,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.progressCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: getColor(),
            borderLeftColor: 'transparent',
            borderBottomColor: score < 75 ? 'transparent' : getColor(),
            borderRightColor: score < 50 ? 'transparent' : getColor(),
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.score,
            {
              color: getColor(),
              fontSize: size * 0.3,
              fontFamily: typography.fontFamily.bold,
            },
          ]}
        >
          {score}
        </Text>
        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                color: c.textSecondary,
                fontSize: size * 0.14,
              },
            ]}
          >
            match
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
  },
  progressCircle: {
    position: 'absolute',
  },
  labelContainer: {
    alignItems: 'center',
  },
  score: {
    fontWeight: '700',
  },
  label: {
    marginTop: -2,
  },
});
