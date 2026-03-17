import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import OnboardingStep from '@/components/OnboardingStep';
import { colors as themeColors, radius, spacing } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { mediumImpact, selectionFeedback } from '@/lib/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_STEPS = 5;

const SENIORITY_OPTIONS = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Staff', 'Principal', 'Director', 'VP', 'C-Suite'];
const REMOTE_OPTIONS = [
  { value: 'remote', label: 'Remote', icon: 'home-outline' },
  { value: 'hybrid', label: 'Hybrid', icon: 'business-outline' },
  { value: 'onsite', label: 'On-site', icon: 'location-outline' },
  { value: 'any', label: 'Any', icon: 'globe-outline' },
] as const;
const VISA_TYPES = ['H-1B', 'O-1', 'L-1', 'TN', 'E-2', 'EB-1', 'EB-2', 'EB-3', 'Other'];
const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker',
  'Kubernetes', 'SQL', 'GraphQL', 'Go', 'Rust', 'Java', 'Swift', 'Kotlin',
  'Machine Learning', 'Data Science', 'DevOps', 'Product Management', 'Design',
];
const CULTURE_OPTIONS = [
  'Work-life balance', 'Fast-paced', 'Innovation-driven', 'Collaborative',
  'Flat hierarchy', 'Mentorship', 'Diversity & inclusion', 'Remote-first',
  'Learning culture', 'Mission-driven',
];
const COMPANY_SIZES = ['Startup (1-50)', 'Small (51-200)', 'Mid (201-1000)', 'Large (1001-5000)', 'Enterprise (5000+)'];

export default function OnboardScreen() {
  const darkMode = useStore((s) => s.darkMode);
  const c = darkMode ? themeColors.dark : themeColors.light;
  const { setOnboardingData, setOnboardingComplete } = useStore();

  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);

  // Step 1
  const [role, setRole] = useState('');
  const [seniority, setSeniority] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  // Step 2
  const [remotePreference, setRemotePreference] = useState<string>('any');
  const [locationInput, setLocationInput] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  // Step 3
  const [visaRequired, setVisaRequired] = useState(false);
  const [visaType, setVisaType] = useState('');

  // Step 4
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  // Step 5
  const [culturePrefs, setCulturePrefs] = useState<string[]>([]);
  const [companySizes, setCompanySizes] = useState<string[]>([]);

  const goToStep = (newStep: number) => {
    scrollRef.current?.scrollTo({ x: newStep * SCREEN_WIDTH, animated: true });
    setStep(newStep);
  };

  const handleNext = async () => {
    await selectionFeedback();
    if (step < TOTAL_STEPS - 1) {
      goToStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) goToStep(step - 1);
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleComplete = async () => {
    await mediumImpact();
    setOnboardingData({
      role,
      seniority,
      salaryMin: parseInt(salaryMin) || 0,
      salaryMax: parseInt(salaryMax) || 0,
      remotePreference: remotePreference as 'remote' | 'hybrid' | 'onsite' | 'any',
      locations,
      visaRequired,
      visaType,
      skills: selectedSkills,
      culturePreferences: culturePrefs,
      companySize: companySizes,
    });
    setOnboardingComplete(true);
    router.replace('/(tabs)/discover');
  };

  const toggleArrayItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
    selectionFeedback();
  };

  const addLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const addCustomSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const ChipSelect = ({
    options,
    selected,
    onToggle,
  }: {
    options: string[];
    selected: string[];
    onToggle: (item: string) => void;
  }) => (
    <View style={styles.chipsContainer}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Pressable
            key={option}
            onPress={() => onToggle(option)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? c.primary + '1A' : c.surface,
                borderColor: isSelected ? c.primary : c.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? c.primary : c.textSecondary },
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          {step > 0 && (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={c.text} />
            </Pressable>
          )}
          <View style={styles.progressDots}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i <= step ? c.primary : c.border,
                    width: i === step ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.stepLabel, { color: c.textTertiary }]}>
            {step + 1}/{TOTAL_STEPS}
          </Text>
        </View>
      </View>

      {/* Steps */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.pager}
      >
        {/* Step 1: Role / Seniority / Salary */}
        <OnboardingStep
          title="What role are you looking for?"
          subtitle="Tell us about the position you're targeting."
        >
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Target Role</Text>
            <TextInput
              style={[styles.textInput, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
              placeholder="e.g. Senior Software Engineer"
              placeholderTextColor={c.textTertiary}
              value={role}
              onChangeText={setRole}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Seniority Level</Text>
            <ChipSelect
              options={SENIORITY_OPTIONS}
              selected={seniority ? [seniority] : []}
              onToggle={(item) => setSeniority(item === seniority ? '' : item)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Salary Range (USD)</Text>
            <View style={styles.salaryRow}>
              <TextInput
                style={[styles.textInput, styles.salaryInput, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
                placeholder="Min (e.g. 120000)"
                placeholderTextColor={c.textTertiary}
                value={salaryMin}
                onChangeText={setSalaryMin}
                keyboardType="numeric"
              />
              <Text style={[styles.salaryDash, { color: c.textTertiary }]}>-</Text>
              <TextInput
                style={[styles.textInput, styles.salaryInput, { color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
                placeholder="Max (e.g. 180000)"
                placeholderTextColor={c.textTertiary}
                value={salaryMax}
                onChangeText={setSalaryMax}
                keyboardType="numeric"
              />
            </View>
          </View>
        </OnboardingStep>

        {/* Step 2: Remote / Location */}
        <OnboardingStep
          title="Where do you want to work?"
          subtitle="Set your work arrangement and location preferences."
        >
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Work Arrangement</Text>
            <View style={styles.remoteOptions}>
              {REMOTE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    setRemotePreference(opt.value);
                    selectionFeedback();
                  }}
                  style={[
                    styles.remoteOption,
                    {
                      backgroundColor: remotePreference === opt.value ? c.primary + '1A' : c.surface,
                      borderColor: remotePreference === opt.value ? c.primary : c.border,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.icon as keyof typeof Ionicons.glyphMap}
                    size={24}
                    color={remotePreference === opt.value ? c.primary : c.textSecondary}
                  />
                  <Text
                    style={[
                      styles.remoteLabel,
                      { color: remotePreference === opt.value ? c.primary : c.text },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Preferred Locations</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.textInput, { flex: 1, color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
                placeholder="e.g. San Francisco, CA"
                placeholderTextColor={c.textTertiary}
                value={locationInput}
                onChangeText={setLocationInput}
                onSubmitEditing={addLocation}
              />
              <Pressable onPress={addLocation} style={[styles.addButton, { backgroundColor: c.primary }]}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
            {locations.length > 0 && (
              <View style={styles.chipsContainer}>
                {locations.map((loc) => (
                  <Pressable
                    key={loc}
                    onPress={() => setLocations(locations.filter((l) => l !== loc))}
                    style={[styles.chip, { backgroundColor: c.primary + '1A', borderColor: c.primary }]}
                  >
                    <Text style={[styles.chipText, { color: c.primary }]}>{loc}</Text>
                    <Ionicons name="close" size={14} color={c.primary} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </OnboardingStep>

        {/* Step 3: Visa */}
        <OnboardingStep
          title="Visa sponsorship needs?"
          subtitle="Skip this step if not applicable."
        >
          <View style={styles.fieldGroup}>
            <Pressable
              onPress={() => {
                setVisaRequired(!visaRequired);
                selectionFeedback();
              }}
              style={[
                styles.toggleRow,
                {
                  backgroundColor: visaRequired ? c.primary + '1A' : c.surface,
                  borderColor: visaRequired ? c.primary : c.border,
                },
              ]}
            >
              <View style={styles.toggleInfo}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color={visaRequired ? c.primary : c.textSecondary}
                />
                <View>
                  <Text style={[styles.toggleTitle, { color: c.text }]}>
                    I need visa sponsorship
                  </Text>
                  <Text style={[styles.toggleSubtitle, { color: c.textSecondary }]}>
                    Only show companies that sponsor
                  </Text>
                </View>
              </View>
              <Ionicons
                name={visaRequired ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={visaRequired ? c.primary : c.textTertiary}
              />
            </Pressable>
          </View>

          {visaRequired && (
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Visa Type</Text>
              <ChipSelect
                options={VISA_TYPES}
                selected={visaType ? [visaType] : []}
                onToggle={(item) => setVisaType(item === visaType ? '' : item)}
              />
            </View>
          )}
        </OnboardingStep>

        {/* Step 4: Skills */}
        <OnboardingStep
          title="What are your top skills?"
          subtitle="Select or add skills to improve job matching."
        >
          <View style={styles.fieldGroup}>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.textInput, { flex: 1, color: c.text, backgroundColor: c.surface, borderColor: c.border }]}
                placeholder="Add a custom skill..."
                placeholderTextColor={c.textTertiary}
                value={skillInput}
                onChangeText={setSkillInput}
                onSubmitEditing={addCustomSkill}
              />
              <Pressable onPress={addCustomSkill} style={[styles.addButton, { backgroundColor: c.primary }]}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Popular Skills</Text>
            <ChipSelect
              options={POPULAR_SKILLS}
              selected={selectedSkills}
              onToggle={(item) => toggleArrayItem(selectedSkills, setSelectedSkills, item)}
            />
          </View>
        </OnboardingStep>

        {/* Step 5: Culture & Preferences */}
        <OnboardingStep
          title="Culture & preferences"
          subtitle="Help us find companies that align with your values."
        >
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Work Culture</Text>
            <ChipSelect
              options={CULTURE_OPTIONS}
              selected={culturePrefs}
              onToggle={(item) => toggleArrayItem(culturePrefs, setCulturePrefs, item)}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>Company Size</Text>
            <ChipSelect
              options={COMPANY_SIZES}
              selected={companySizes}
              onToggle={(item) => toggleArrayItem(companySizes, setCompanySizes, item)}
            />
          </View>
        </OnboardingStep>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: c.border }]}>
        {step === 2 && (
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: c.textSecondary }]}>Skip</Text>
          </Pressable>
        )}
        <Pressable
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: c.primary }]}
        >
          <Text style={styles.nextButtonText}>
            {step === TOTAL_STEPS - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '500',
    width: 36,
    textAlign: 'right',
  },
  pager: {
    flex: 1,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: radius.base,
    paddingHorizontal: spacing.base,
    height: 48,
    fontSize: 15,
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  salaryInput: {
    flex: 1,
  },
  salaryDash: {
    fontSize: 18,
    fontWeight: '500',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  remoteOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  remoteOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.base,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  remoteLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: radius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderRadius: radius.base,
    borderWidth: 1,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  toggleSubtitle: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  skipButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.base,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
