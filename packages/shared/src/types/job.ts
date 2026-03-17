export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  seniority: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  skills_required: string[];
  skills_preferred: string[];
  location: string;
  is_remote: boolean;
  is_hybrid: boolean;
  visa_sponsorship_mentioned: boolean;
  visa_sponsorship_signals: string[];
  /** AI-generated summary of the job posting */
  ai_summary?: string;
  /** AI-detected red flags */
  ai_red_flags: string[];
  /** AI-detected green flags */
  ai_green_flags: string[];
  /** AI-computed culture score (0-100) */
  ai_culture_score?: number;
  source: string;
  source_url?: string;
  posted_at?: string;
  expires_at?: string;
  status: "active" | "closed" | "expired";
  embedding?: number[];
  raw_html?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  logo_url?: string;
  industry?: string;
  size: string;
  description?: string;
  headquarters?: string;
  glassdoor_rating?: number;
  glassdoor_url?: string;
  known_sponsor: boolean;
  h1b_filings_count: number;
  tech_stack: string[];
  benefits: string[];
  embedding?: number[];
  created_at: string;
  updated_at: string;
}
