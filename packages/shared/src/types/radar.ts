export interface RadarConfig {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  excluded_keywords: string[];
  title_patterns: string[];
  company_ids: string[];
  min_salary?: number;
  remote_only: boolean;
  must_sponsor: boolean;
  locations: string[];
  industries: string[];
  frequency: "realtime" | "hourly" | "daily" | "weekly";
  is_active: boolean;
  last_run_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RadarResult {
  id: string;
  radar_config_id: string;
  job_id: string;
  matched_keywords: string[];
  matched_at: string;
  notified: boolean;
  notified_at?: string;
}
