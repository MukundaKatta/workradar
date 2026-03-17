export {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
} from "./embeddings.js";

export {
  parseJobPosting,
  analyzeJobPosting,
  type ParsedJobPosting,
  type JobAnalysis,
} from "./parser.js";

export {
  calculateMatchScore,
  type MatchProfile,
  type MatchJob,
  type MatchResult,
} from "./matcher.js";

export {
  CareerCoach,
  type CoachMessage,
  type ProfileContext,
} from "./coach.js";

export {
  PARSE_JOB_POSTING_SYSTEM,
  PARSE_JOB_POSTING_USER,
  ANALYZE_JOB_SYSTEM,
  ANALYZE_JOB_USER,
  CAREER_COACH_SYSTEM,
  CAREER_COACH_WITH_CONTEXT,
  SKILL_ASSESSMENT_SYSTEM,
  DISPLACEMENT_RISK_SYSTEM,
  MATCH_EXPLANATION_SYSTEM,
  MATCH_EXPLANATION_USER,
} from "./prompts.js";
