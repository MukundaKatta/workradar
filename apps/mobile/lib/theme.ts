import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const colors = {
  light: {
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    navy: '#0F172A',
    emerald: '#10B981',
    amber: '#F59E0B',
    rose: '#F43F5E',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    statusBar: 'dark' as const,
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  dark: {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    border: '#334155',
    borderLight: '#1E293B',
    success: '#34D399',
    successLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#78350F',
    error: '#F87171',
    errorLight: '#7F1D1D',
    navy: '#F8FAFC',
    emerald: '#34D399',
    amber: '#FBBF24',
    rose: '#FB7185',
    card: '#1E293B',
    cardBorder: '#334155',
    tabBar: '#1E293B',
    tabBarBorder: '#334155',
    statusBar: 'light' as const,
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

export type ThemeColors = typeof colors.light;
export type ColorScheme = 'light' | 'dark';

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

export const radius = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  cardWidth: SCREEN_WIDTH - spacing.base * 2,
  maxContentWidth: 600,
} as const;
