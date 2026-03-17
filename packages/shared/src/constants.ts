export const VISA_STATUSES = [
  "us_citizen",
  "green_card",
  "h1b",
  "h1b_transfer",
  "h4_ead",
  "l1",
  "l2_ead",
  "o1",
  "opt",
  "opt_stem",
  "cpt",
  "tn",
  "e2",
  "e3",
  "j1",
  "f1",
  "other",
  "not_applicable",
] as const;

export type VisaStatus = (typeof VISA_STATUSES)[number];

export const SENIORITY_LEVELS = [
  "intern",
  "entry",
  "junior",
  "mid",
  "senior",
  "staff",
  "principal",
  "lead",
  "manager",
  "director",
  "vp",
  "c_level",
] as const;

export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number];

export const COMPANY_SIZES = [
  "startup_1_10",
  "small_11_50",
  "medium_51_200",
  "mid_market_201_1000",
  "large_1001_5000",
  "enterprise_5001_plus",
] as const;

export type CompanySize = (typeof COMPANY_SIZES)[number];

export const CULTURE_VALUES = [
  "work_life_balance",
  "innovation",
  "diversity_inclusion",
  "mentorship",
  "remote_first",
  "flat_hierarchy",
  "fast_paced",
  "mission_driven",
  "learning_culture",
  "team_collaboration",
  "autonomy",
  "transparency",
  "social_impact",
  "competitive_pay",
  "equity_heavy",
  "flexible_hours",
  "unlimited_pto",
  "parental_leave",
  "wellness_benefits",
  "career_growth",
] as const;

export type CultureValue = (typeof CULTURE_VALUES)[number];

export const INDUSTRIES = [
  "technology",
  "fintech",
  "healthcare",
  "biotech",
  "edtech",
  "ecommerce",
  "saas",
  "ai_ml",
  "cybersecurity",
  "blockchain",
  "gaming",
  "media_entertainment",
  "consulting",
  "finance_banking",
  "insurance",
  "real_estate",
  "manufacturing",
  "automotive",
  "aerospace",
  "energy",
  "government",
  "nonprofit",
  "legal",
  "retail",
  "logistics",
  "telecom",
  "agriculture",
  "construction",
  "travel_hospitality",
  "food_beverage",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const SKILL_CATEGORIES = [
  "programming_language",
  "framework",
  "database",
  "cloud",
  "devops",
  "ai_ml",
  "data_engineering",
  "frontend",
  "backend",
  "mobile",
  "security",
  "design",
  "product",
  "management",
  "communication",
  "domain_knowledge",
  "certification",
  "tool",
  "methodology",
  "other",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const REMOTE_PREFERENCES = [
  "remote",
  "hybrid",
  "onsite",
  "flexible",
] as const;

export type RemotePreference = (typeof REMOTE_PREFERENCES)[number];

/** Embedding dimension for OpenAI text-embedding-3-small */
export const EMBEDDING_DIMENSION = 1536;

/** Match score weights for the weighted scoring algorithm */
export const MATCH_WEIGHTS = {
  skill: 0.30,
  experience: 0.15,
  salary: 0.15,
  location: 0.10,
  visa: 0.10,
  culture: 0.10,
  vector_similarity: 0.10,
} as const;
