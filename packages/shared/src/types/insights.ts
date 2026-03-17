export interface SkillAssessment {
  id: string;
  user_id: string;
  skill: string;
  category: string;
  /** Self-reported proficiency 1-5 */
  self_rating: number;
  /** AI-assessed proficiency 1-5 based on work history and resume */
  ai_rating?: number;
  /** Market demand score 0-100 */
  market_demand: number;
  /** How many matching jobs require this skill (percentage) */
  job_prevalence: number;
  /** Trending up, stable, or declining */
  trend: "rising" | "stable" | "declining";
  assessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface SkillGap {
  skill: string;
  category: string;
  /** How critical this gap is for target roles (0-100) */
  importance: number;
  /** Current proficiency 0-5 (0 = missing) */
  current_level: number;
  /** Required proficiency for target roles */
  required_level: number;
  /** Number of target jobs requiring this skill */
  jobs_requiring: number;
  /** Estimated time to close the gap */
  estimated_learning_hours: number;
  /** Suggested resources */
  recommended_resources: string[];
}

export interface ReskillPath {
  id: string;
  user_id: string;
  target_role: string;
  current_match_percentage: number;
  skills_to_acquire: SkillGap[];
  estimated_timeline_weeks: number;
  recommended_courses: string[];
  recommended_certifications: string[];
  salary_impact: {
    current_median: number;
    target_median: number;
    potential_increase_pct: number;
  };
  created_at: string;
}

export interface CareerPivot {
  target_role: string;
  similarity_score: number;
  transferable_skills: string[];
  missing_skills: string[];
  market_outlook: "hot" | "growing" | "stable" | "shrinking";
  avg_salary: number;
  estimated_transition_months: number;
}

export interface AiDisplacementRisk {
  role: string;
  risk_level: "low" | "medium" | "high" | "critical";
  risk_score: number;
  /** Which tasks in this role are most at risk */
  at_risk_tasks: string[];
  /** Skills that make you more resilient */
  resilient_skills: string[];
  /** Recommended pivots to reduce risk */
  recommended_pivots: CareerPivot[];
  analysis_date: string;
}
