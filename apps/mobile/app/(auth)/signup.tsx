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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors as themeColors, typography, radius, spacing } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { mediumImpact } from '@/lib/haptics';

export default function SignupScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): string | null => {
    if (!name.trim()) return 'Please enter your name';
    if (!email.trim()) return 'Please enter your email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSignup = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        await mediumImpact();
        router.replace('/(auth)/onboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={c.text} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Text style={[styles.title, { color: c.text }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: c.textSecondary }]}>
                Start your AI-powered job search
              </Text>
            </View>

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: c.errorLight }]}>
                <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: c.surface, borderColor: c.border },
                ]}
              >
                <Ionicons name="person-outline" size={20} color={c.textTertiary} />
                <TextInput
                  style={[styles.input, { color: c.text }]}
                  placeholder="Full name"
                  placeholderTextColor={c.textTertiary}
                  value={name}
                  onChangeText={setName}
                  autoComplete="name"
                />
              </View>

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
                  placeholder="Password (min 8 characters)"
                  placeholderTextColor={c.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={c.textTertiary}
                  />
                </Pressable>
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
                  placeholder="Confirm password"
                  placeholderTextColor={c.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>

              <Pressable
                onPress={handleSignup}
                disabled={loading}
                style={[
                  styles.signupButton,
                  { backgroundColor: c.primary, opacity: loading ? 0.7 : 1 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </Pressable>
            </View>

            <View style={styles.loginRow}>
              <Text style={[styles.loginText, { color: c.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.back()}>
                <Text style={[styles.loginLink, { color: c.primary }]}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  titleSection: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  errorBox: {
    padding: spacing.md,
    borderRadius: radius.base,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
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
  signupButton: {
    height: 52,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
