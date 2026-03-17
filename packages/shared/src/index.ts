// Types
export type {
  Profile,
  SalaryRange,
  LocationPreference,
  WorkHistory,
  Resume,
  OnboardingData,
} from "./types/profile.js";

export type { Job, Company } from "./types/job.js";

export {
  DiscoveryAction,
  type MatchScores,
  type Discovery,
} from "./types/discovery.js";

export type { RadarConfig, RadarResult } from "./types/radar.js";

export {
  ApplicationStatus,
  APPLICATION_PIPELINE,
  type Application,
  type ApplicationTimelineEntry,
} from "./types/application.js";

export type {
  SkillAssessment,
  SkillGap,
  ReskillPath,
  CareerPivot,
  AiDisplacementRisk,
} from "./types/insights.js";

// Constants
export {
  VISA_STATUSES,
  SENIORITY_LEVELS,
  COMPANY_SIZES,
  CULTURE_VALUES,
  INDUSTRIES,
  SKILL_CATEGORIES,
  REMOTE_PREFERENCES,
  EMBEDDING_DIMENSION,
  MATCH_WEIGHTS,
  type VisaStatus,
  type SeniorityLevel,
  type CompanySize,
  type CultureValue,
  type Industry,
  type SkillCategory,
  type RemotePreference,
} from "./constants.js";

// Validation schemas
export {
  salaryRangeSchema,
  locationPreferenceSchema,
  profileSchema,
  workHistorySchema,
  resumeSchema,
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  onboardingStep4Schema,
  onboardingStep5Schema,
  onboardingDataSchema,
  jobSchema,
  companySchema,
  discoveryActionSchema,
  matchScoresSchema,
  discoverySchema,
  radarConfigSchema,
  radarResultSchema,
  applicationStatusSchema,
  applicationTimelineEntrySchema,
  applicationSchema,
  skillAssessmentSchema,
  skillGapSchema,
  reskillPathSchema,
  careerPivotSchema,
  aiDisplacementRiskSchema,
} from "./validation.js";
