import { z } from "zod";
import {
  VISA_STATUSES,
  SENIORITY_LEVELS,
  COMPANY_SIZES,
  CULTURE_VALUES,
  INDUSTRIES,
  SKILL_CATEGORIES,
  REMOTE_PREFERENCES,
} from "./constants.js";

// ─── Primitives ──────────────────────────────────────────────

export const salaryRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: z.string().length(3).default("USD"),
}).refine((data) => data.max >= data.min, {
  message: "max salary must be >= min salary",
});

export const locationPreferenceSchema = z.object({
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  willing_to_relocate: z.boolean().default(false),
});

// ─── Profile ─────────────────────────────────────────────────

export const profileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  desired_roles: z.array(z.string().min(1)).min(1),
  seniority: z.enum(SENIORITY_LEVELS),
  salary_range: salaryRangeSchema,
  location_preferences: z.array(locationPreferenceSchema),
  remote_preference: z.enum(REMOTE_PREFERENCES),
  visa_status: z.enum(VISA_STATUSES),
  needs_sponsorship: z.boolean(),
  skills: z.array(z.string().min(1)),
  industries: z.array(z.enum(INDUSTRIES)),
  company_size_preference: z.array(z.enum(COMPANY_SIZES)),
  culture_values: z.array(z.enum(CULTURE_VALUES)),
  deal_breakers: z.array(z.string()),
  years_of_experience: z.number().min(0).max(50),
  education_level: z.string().optional(),
  onboarding_completed: z.boolean().default(false),
  embedding: z.array(z.number()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const workHistorySchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  company_name: z.string().min(1),
  title: z.string().min(1),
  start_date: z.string(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
  skills_used: z.array(z.string()),
  achievements: z.array(z.string()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const resumeSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  file_url: z.string().url(),
  file_name: z.string().min(1),
  parsed_text: z.string().optional(),
  parsed_skills: z.array(z.string()),
  parsed_experience_years: z.number().min(0).optional(),
  uploaded_at: z.string().datetime(),
});

// ─── Onboarding ──────────────────────────────────────────────

export const onboardingStep1Schema = z.object({
  desired_roles: z.array(z.string().min(1)).min(1),
  seniority: z.enum(SENIORITY_LEVELS),
  years_of_experience: z.number().min(0).max(50),
  education_level: z.string().optional(),
});

export const onboardingStep2Schema = z.object({
  skills: z.array(z.string().min(1)).min(1),
  industries: z.array(z.enum(INDUSTRIES)).min(1),
});

export const onboardingStep3Schema = z.object({
  salary_range: salaryRangeSchema,
  location_preferences: z.array(locationPreferenceSchema).min(1),
  remote_preference: z.enum(REMOTE_PREFERENCES),
});

export const onboardingStep4Schema = z.object({
  visa_status: z.enum(VISA_STATUSES),
  needs_sponsorship: z.boolean(),
});

export const onboardingStep5Schema = z.object({
  company_size_preference: z.array(z.enum(COMPANY_SIZES)),
  culture_values: z.array(z.enum(CULTURE_VALUES)),
  deal_breakers: z.array(z.string()),
});

export const onboardingDataSchema = z.object({
  step1: onboardingStep1Schema,
  step2: onboardingStep2Schema,
  step3: onboardingStep3Schema,
  step4: onboardingStep4Schema,
  step5: onboardingStep5Schema,
});

// ─── Job & Company ───────────────────────────────────────────

export const jobSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  seniority: z.enum(SENIORITY_LEVELS),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  salary_currency: z.string().length(3).default("USD"),
  skills_required: z.array(z.string()),
  skills_preferred: z.array(z.string()),
  location: z.string(),
  is_remote: z.boolean().default(false),
  is_hybrid: z.boolean().default(false),
  visa_sponsorship_mentioned: z.boolean().default(false),
  visa_sponsorship_signals: z.array(z.string()),
  ai_summary: z.string().optional(),
  ai_red_flags: z.array(z.string()),
  ai_green_flags: z.array(z.string()),
  ai_culture_score: z.number().min(0).max(100).optional(),
  source: z.string().min(1),
  source_url: z.string().url().optional(),
  posted_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
  status: z.enum(["active", "closed", "expired"]).default("active"),
  embedding: z.array(z.number()).optional(),
  raw_html: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const companySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  domain: z.string().optional(),
  logo_url: z.string().url().optional(),
  industry: z.enum(INDUSTRIES).optional(),
  size: z.enum(COMPANY_SIZES),
  description: z.string().optional(),
  headquarters: z.string().optional(),
  glassdoor_rating: z.number().min(0).max(5).optional(),
  glassdoor_url: z.string().url().optional(),
  known_sponsor: z.boolean().default(false),
  h1b_filings_count: z.number().min(0).default(0),
  tech_stack: z.array(z.string()),
  benefits: z.array(z.string()),
  embedding: z.array(z.number()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ─── Discovery ───────────────────────────────────────────────

export const discoveryActionSchema = z.enum([
  "unseen",
  "seen",
  "saved",
  "applied",
  "dismissed",
  "not_interested",
]);

export const matchScoresSchema = z.object({
  overall_score: z.number().min(0).max(100),
  skill_score: z.number().min(0).max(100),
  experience_score: z.number().min(0).max(100),
  salary_score: z.number().min(0).max(100),
  location_score: z.number().min(0).max(100),
  visa_score: z.number().min(0).max(100),
  culture_score: z.number().min(0).max(100),
  vector_similarity: z.number().min(0).max(1),
});

export const discoverySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  job_id: z.string().uuid(),
  scores: matchScoresSchema,
  match_reason: z.string(),
  user_action: discoveryActionSchema,
  discovery_source: z.string(),
  seen_at: z.string().datetime().optional(),
  acted_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ─── Radar ───────────────────────────────────────────────────

export const radarConfigSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  keywords: z.array(z.string()),
  excluded_keywords: z.array(z.string()),
  title_patterns: z.array(z.string()),
  company_ids: z.array(z.string().uuid()),
  min_salary: z.number().min(0).optional(),
  remote_only: z.boolean().default(false),
  must_sponsor: z.boolean().default(false),
  locations: z.array(z.string()),
  industries: z.array(z.enum(INDUSTRIES)),
  frequency: z.enum(["realtime", "hourly", "daily", "weekly"]).default("daily"),
  is_active: z.boolean().default(true),
  last_run_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const radarResultSchema = z.object({
  id: z.string().uuid(),
  radar_config_id: z.string().uuid(),
  job_id: z.string().uuid(),
  matched_keywords: z.array(z.string()),
  matched_at: z.string().datetime(),
  notified: z.boolean().default(false),
  notified_at: z.string().datetime().optional(),
});

// ─── Application ─────────────────────────────────────────────

export const applicationStatusSchema = z.enum([
  "interested",
  "applying",
  "applied",
  "screening",
  "phone_screen",
  "technical",
  "onsite",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
  "ghosted",
]);

export const applicationTimelineEntrySchema = z.object({
  status: applicationStatusSchema,
  timestamp: z.string().datetime(),
  note: z.string().optional(),
});

export const applicationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  job_id: z.string().uuid(),
  company_id: z.string().uuid(),
  status: applicationStatusSchema,
  applied_at: z.string().datetime().optional(),
  response_at: z.string().datetime().optional(),
  next_step: z.string().optional(),
  next_step_date: z.string().datetime().optional(),
  salary_offered: z.number().min(0).optional(),
  notes: z.string().default(""),
  resume_id: z.string().uuid().optional(),
  cover_letter_url: z.string().url().optional(),
  referral_contact: z.string().optional(),
  timeline: z.array(applicationTimelineEntrySchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ─── Insights ────────────────────────────────────────────────

export const skillAssessmentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  skill: z.string().min(1),
  category: z.enum(SKILL_CATEGORIES),
  self_rating: z.number().min(1).max(5),
  ai_rating: z.number().min(1).max(5).optional(),
  market_demand: z.number().min(0).max(100),
  job_prevalence: z.number().min(0).max(100),
  trend: z.enum(["rising", "stable", "declining"]),
  assessed_at: z.string().datetime(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const skillGapSchema = z.object({
  skill: z.string().min(1),
  category: z.enum(SKILL_CATEGORIES),
  importance: z.number().min(0).max(100),
  current_level: z.number().min(0).max(5),
  required_level: z.number().min(1).max(5),
  jobs_requiring: z.number().min(0),
  estimated_learning_hours: z.number().min(0),
  recommended_resources: z.array(z.string()),
});

export const reskillPathSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  target_role: z.string().min(1),
  current_match_percentage: z.number().min(0).max(100),
  skills_to_acquire: z.array(skillGapSchema),
  estimated_timeline_weeks: z.number().min(0),
  recommended_courses: z.array(z.string()),
  recommended_certifications: z.array(z.string()),
  salary_impact: z.object({
    current_median: z.number(),
    target_median: z.number(),
    potential_increase_pct: z.number(),
  }),
  created_at: z.string().datetime(),
});

export const careerPivotSchema = z.object({
  target_role: z.string().min(1),
  similarity_score: z.number().min(0).max(100),
  transferable_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  market_outlook: z.enum(["hot", "growing", "stable", "shrinking"]),
  avg_salary: z.number().min(0),
  estimated_transition_months: z.number().min(0),
});

export const aiDisplacementRiskSchema = z.object({
  role: z.string().min(1),
  risk_level: z.enum(["low", "medium", "high", "critical"]),
  risk_score: z.number().min(0).max(100),
  at_risk_tasks: z.array(z.string()),
  resilient_skills: z.array(z.string()),
  recommended_pivots: z.array(careerPivotSchema),
  analysis_date: z.string().datetime(),
});
