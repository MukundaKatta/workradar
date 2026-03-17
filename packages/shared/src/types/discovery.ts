export const DiscoveryAction = {
  UNSEEN: "unseen",
  SEEN: "seen",
  SAVED: "saved",
  APPLIED: "applied",
  DISMISSED: "dismissed",
  NOT_INTERESTED: "not_interested",
} as const;

export type DiscoveryAction =
  (typeof DiscoveryAction)[keyof typeof DiscoveryAction];

export interface MatchScores {
  overall_score: number;
  skill_score: number;
  experience_score: number;
  salary_score: number;
  location_score: number;
  visa_score: number;
  culture_score: number;
  vector_similarity: number;
}

export interface Discovery {
  id: string;
  user_id: string;
  job_id: string;
  scores: MatchScores;
  match_reason: string;
  user_action: DiscoveryAction;
  discovery_source: string;
  seen_at?: string;
  acted_at?: string;
  created_at: string;
  updated_at: string;
}
