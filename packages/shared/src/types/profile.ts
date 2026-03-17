export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface LocationPreference {
  city: string;
  state?: string;
  country: string;
  willing_to_relocate: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  desired_roles: string[];
  seniority: string;
  salary_range: SalaryRange;
  location_preferences: LocationPreference[];
  remote_preference: "remote" | "hybrid" | "onsite" | "flexible";
  visa_status: string;
  needs_sponsorship: boolean;
  skills: string[];
  industries: string[];
  company_size_preference: string[];
  culture_values: string[];
  deal_breakers: string[];
  years_of_experience: number;
  education_level?: string;
  onboarding_completed: boolean;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface WorkHistory {
  id: string;
  profile_id: string;
  company_name: string;
  title: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  skills_used: string[];
  achievements: string[];
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  profile_id: string;
  file_url: string;
  file_name: string;
  parsed_text?: string;
  parsed_skills: string[];
  parsed_experience_years?: number;
  uploaded_at: string;
}

/** Data collected during the 5-step onboarding wizard */
export interface OnboardingData {
  /** Step 1: Basic info & desired roles */
  step1: {
    desired_roles: string[];
    seniority: string;
    years_of_experience: number;
    education_level?: string;
  };
  /** Step 2: Skills & industries */
  step2: {
    skills: string[];
    industries: string[];
  };
  /** Step 3: Compensation & location */
  step3: {
    salary_range: SalaryRange;
    location_preferences: LocationPreference[];
    remote_preference: "remote" | "hybrid" | "onsite" | "flexible";
  };
  /** Step 4: Visa & sponsorship */
  step4: {
    visa_status: string;
    needs_sponsorship: boolean;
  };
  /** Step 5: Culture & preferences */
  step5: {
    company_size_preference: string[];
    culture_values: string[];
    deal_breakers: string[];
  };
}
