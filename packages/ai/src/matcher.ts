import { cosineSimilarity } from "./embeddings.js";

/**
 * Weights for the composite match score.
 * Must sum to 1.0.
 */
const WEIGHTS = {
  skill: 0.30,
  experience: 0.15,
  salary: 0.15,
  location: 0.10,
  visa: 0.10,
  culture: 0.10,
  vector_similarity: 0.10,
} as const;

export interface MatchProfile {
  desired_roles: string[];
  seniority: string;
  salary_min?: number;
  salary_max?: number;
  remote_preference: string;
  visa_status: string;
  needs_sponsorship: boolean;
  skills: string[];
  culture_values: string[];
  years_of_experience: number;
  location_preferences: Array<{ city: string; country: string }>;
  embedding?: number[];
}

export interface MatchJob {
  title: string;
  seniority: string;
  salary_min?: number | null;
  salary_max?: number | null;
  skills_required: string[];
  skills_preferred: string[];
  is_remote: boolean;
  is_hybrid: boolean;
  location: string;
  visa_sponsorship_mentioned: boolean;
  ai_culture_score?: number | null;
  embedding?: number[] | null;
}

export interface MatchResult {
  overall_score: number;
  skill_score: number;
  experience_score: number;
  salary_score: number;
  location_score: number;
  visa_score: number;
  culture_score: number;
  vector_similarity: number;
  match_reason: string;
}

/**
 * Calculate the weighted composite match score between a user profile and a job.
 * Each sub-score is 0-100. The overall score is a weighted average.
 */
export function calculateMatchScore(
  profile: MatchProfile,
  job: MatchJob
): MatchResult {
  const skill = computeSkillScore(profile, job);
  const experience = computeExperienceScore(profile, job);
  const salary = computeSalaryScore(profile, job);
  const location = computeLocationScore(profile, job);
  const visa = computeVisaScore(profile, job);
  const culture = computeCultureScore(profile, job);
  const vectorSim = computeVectorSimilarity(profile, job);

  const overall = Math.round(
    skill * WEIGHTS.skill +
      experience * WEIGHTS.experience +
      salary * WEIGHTS.salary +
      location * WEIGHTS.location +
      visa * WEIGHTS.visa +
      culture * WEIGHTS.culture +
      vectorSim * 100 * WEIGHTS.vector_similarity
  );

  const reasons: string[] = [];
  if (skill >= 70) reasons.push("strong skill match");
  if (experience >= 70) reasons.push("experience level aligns");
  if (salary >= 80) reasons.push("salary in range");
  if (location >= 80) reasons.push("location compatible");
  if (visa >= 80) reasons.push("visa requirements met");
  if (culture >= 70) reasons.push("good culture fit");

  if (skill < 40) reasons.push("skill gap");
  if (visa < 30 && profile.needs_sponsorship) reasons.push("sponsorship unclear");

  return {
    overall_score: Math.max(0, Math.min(100, overall)),
    skill_score: skill,
    experience_score: experience,
    salary_score: salary,
    location_score: location,
    visa_score: visa,
    culture_score: culture,
    vector_similarity: vectorSim,
    match_reason: reasons.join("; ") || "general match",
  };
}

/** Compute skill match as percentage of required + preferred skills matched */
function computeSkillScore(profile: MatchProfile, job: MatchJob): number {
  const profileSkills = new Set(
    profile.skills.map((s) => s.toLowerCase().trim())
  );

  const requiredCount = job.skills_required.length;
  const preferredCount = job.skills_preferred.length;
  const totalSkills = requiredCount + preferredCount;

  if (totalSkills === 0) return 70; // no skills listed = neutral match

  const requiredMatches = job.skills_required.filter((s) =>
    profileSkills.has(s.toLowerCase().trim())
  ).length;

  const preferredMatches = job.skills_preferred.filter((s) =>
    profileSkills.has(s.toLowerCase().trim())
  ).length;

  // Required skills weighted 2x vs preferred
  const weightedMatch = requiredMatches * 2 + preferredMatches;
  const weightedTotal = requiredCount * 2 + preferredCount;

  return Math.round((weightedMatch / weightedTotal) * 100);
}

/** Compare seniority levels for experience fit */
function computeExperienceScore(
  profile: MatchProfile,
  job: MatchJob
): number {
  const seniorityOrder = [
    "intern", "entry", "junior", "mid", "senior",
    "staff", "principal", "lead", "manager", "director", "vp", "c_level",
  ];

  const profileIdx = seniorityOrder.indexOf(profile.seniority);
  const jobIdx = seniorityOrder.indexOf(job.seniority);

  if (profileIdx === -1 || jobIdx === -1) return 50;

  const diff = Math.abs(profileIdx - jobIdx);

  if (diff === 0) return 100;
  if (diff === 1) return 80;
  if (diff === 2) return 50;
  return Math.max(0, 30 - (diff - 3) * 15);
}

/** Check salary overlap between profile expectations and job offer */
function computeSalaryScore(profile: MatchProfile, job: MatchJob): number {
  const pMin = profile.salary_min;
  const pMax = profile.salary_max;
  const jMin = job.salary_min;
  const jMax = job.salary_max;

  // If either side has no salary info, neutral score
  if (!pMin && !pMax) return 60;
  if (!jMin && !jMax) return 50;

  const profileMin = pMin ?? 0;
  const profileMax = pMax ?? Infinity;
  const jobMin = jMin ?? 0;
  const jobMax = jMax ?? Infinity;

  // Perfect overlap
  if (jobMax >= profileMin && jobMin <= profileMax) {
    // How much of the profile range is covered
    const overlapMin = Math.max(profileMin, jobMin);
    const overlapMax = Math.min(profileMax, jobMax);
    const profileRange = profileMax === Infinity ? profileMin * 2 : profileMax - profileMin;

    if (profileRange === 0) return jobMax >= profileMin ? 100 : 20;

    const overlapPct = (overlapMax - overlapMin) / profileRange;
    return Math.round(Math.min(100, 50 + overlapPct * 50));
  }

  // Job pays more than expected — still good
  if (jobMin > profileMax) return 90;

  // Job pays less
  const gap = profileMin - (jobMax ?? jobMin ?? 0);
  const gapPct = profileMin > 0 ? gap / profileMin : 0;

  if (gapPct < 0.1) return 60;
  if (gapPct < 0.2) return 40;
  return 20;
}

/** Check location compatibility */
function computeLocationScore(profile: MatchProfile, job: MatchJob): number {
  // Remote job matches remote/flexible preference
  if (job.is_remote) {
    if (
      profile.remote_preference === "remote" ||
      profile.remote_preference === "flexible"
    ) {
      return 100;
    }
    return 70; // remote job is still accessible
  }

  if (
    profile.remote_preference === "remote" &&
    !job.is_remote &&
    !job.is_hybrid
  ) {
    return 20; // user wants remote, job is onsite
  }

  if (job.is_hybrid && profile.remote_preference === "remote") {
    return 50;
  }

  // Check if job location matches any preference
  const jobLocation = job.location.toLowerCase();
  const locationMatch = profile.location_preferences.some(
    (loc) =>
      jobLocation.includes(loc.city.toLowerCase()) ||
      jobLocation.includes(loc.country.toLowerCase())
  );

  if (locationMatch) return 90;

  // No location match, but user is flexible
  if (profile.remote_preference === "flexible") return 50;

  return 30;
}

/** Check visa/sponsorship compatibility */
function computeVisaScore(profile: MatchProfile, job: MatchJob): number {
  // User does not need sponsorship — always fine
  if (!profile.needs_sponsorship) return 100;

  // User needs sponsorship and job mentions it
  if (job.visa_sponsorship_mentioned) return 100;

  // User needs sponsorship but job says nothing — uncertain
  return 40;
}

/** Compare culture values */
function computeCultureScore(profile: MatchProfile, job: MatchJob): number {
  if (job.ai_culture_score != null) {
    // Blend AI culture score with basic comparison
    return Math.round(job.ai_culture_score * 0.7 + 50 * 0.3);
  }

  // Without AI culture analysis, return neutral
  return 50;
}

/** Compute cosine similarity between profile and job embeddings */
function computeVectorSimilarity(
  profile: MatchProfile,
  job: MatchJob
): number {
  if (!profile.embedding || !job.embedding) return 0.5;

  const similarity = cosineSimilarity(profile.embedding, job.embedding);
  // Normalize from [-1, 1] to [0, 1]
  return Math.max(0, Math.min(1, (similarity + 1) / 2));
}
