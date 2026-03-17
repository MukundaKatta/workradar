import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors as themeColors, typography, radius, spacing } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { mediumImpact } from '@/lib/haptics';

export default function LoginScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        await mediumImpact();
        router.replace('/(tabs)/discover');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'linkedin_oidc') => {
    await mediumImpact();
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
      });
      if (authError) setError(authError.message);
    } catch (err) {
      setError('Social login failed');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={[styles.logoCircle, { backgroundColor: c.primary }]}>
              <Ionicons name="radio" size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.appName, { color: c.text }]}>WorkRadar</Text>
            <Text style={[styles.tagline, { color: c.textSecondary }]}>
              Find your perfect role with AI-powered matching
            </Text>
          </View>

          {/* Error */}
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: c.errorLight }]}>
              <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <Ionicons name="mail-outline" size={20} color={c.textTertiary} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                placeholder="Email address"
                placeholderTextColor={c.textTertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color={c.textTertiary} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                placeholder="Password"
                placeholderTextColor={c.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={c.textTertiary}
                />
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={[
                styles.loginButton,
                { backgroundColor: c.primary, opacity: loading ? 0.7 : 1 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
            <Text style={[styles.dividerText, { color: c.textTertiary }]}>
              or continue with
            </Text>
            <View style={[styles.divider, { backgroundColor: c.border }]} />
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <Pressable
              onPress={() => handleSocialLogin('google')}
              style={[
                styles.socialButton,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <Ionicons name="logo-google" size={22} color="#DB4437" />
            </Pressable>
            <Pressable
              onPress={() => handleSocialLogin('apple')}
              style={[
                styles.socialButton,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <Ionicons name="logo-apple" size={22} color={c.text} />
            </Pressable>
            <Pressable
              onPress={() => handleSocialLogin('linkedin_oidc')}
              style={[
                styles.socialButton,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
              <Ionicons name="logo-linkedin" size={22} color="#0077B5" />
            </Pressable>
          </View>

          {/* Signup link */}
          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: c.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <Text style={[styles.signupLink, { color: c.primary }]}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: radius.base,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.base,
    paddingHorizontal: spacing.base,
    height: 52,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  loginButton: {
    height: 52,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.base,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: radius.base,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
