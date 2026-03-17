import React from 'react';
import { Stack } from 'expo-router';
import { useStore } from '@/lib/store';
import { colors as themeColors } from '@/lib/theme';

export default function AuthLayout() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="onboard" />
    </Stack>
  );
}
