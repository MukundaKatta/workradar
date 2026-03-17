/**
 * Database type definitions matching the Supabase schema.
 * In production, regenerate with: npx supabase gen types typescript
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          desired_roles: string[];
          seniority: string;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          location_preferences: Json;
          remote_preference: string;
          visa_status: string;
          needs_sponsorship: boolean;
          skills: string[];
          industries: string[];
          company_size_preference: string[];
          culture_values: string[];
          deal_breakers: string[];
          years_of_experience: number;
          education_level: string | null;
          onboarding_completed: boolean;
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          desired_roles?: string[];
          seniority?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          location_preferences?: Json;
          remote_preference?: string;
          visa_status?: string;
          needs_sponsorship?: boolean;
          skills?: string[];
          industries?: string[];
          company_size_preference?: string[];
          culture_values?: string[];
          deal_breakers?: string[];
          years_of_experience?: number;
          education_level?: string | null;
          onboarding_completed?: boolean;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          desired_roles?: string[];
          seniority?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          location_preferences?: Json;
          remote_preference?: string;
          visa_status?: string;
          needs_sponsorship?: boolean;
          skills?: string[];
          industries?: string[];
          company_size_preference?: string[];
          culture_values?: string[];
          deal_breakers?: string[];
          years_of_experience?: number;
          education_level?: string | null;
          onboarding_completed?: boolean;
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_history: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          title: string;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          skills_used: string[];
          achievements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          title: string;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          skills_used?: string[];
          achievements?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          company_name?: string;
          title?: string;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          skills_used?: string[];
          achievements?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          profile_id: string;
          file_url: string;
          file_name: string;
          parsed_text: string | null;
          parsed_skills: string[];
          parsed_experience_years: number | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          file_url: string;
          file_name: string;
          parsed_text?: string | null;
          parsed_skills?: string[];
          parsed_experience_years?: number | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          file_url?: string;
          file_name?: string;
          parsed_text?: string | null;
          parsed_skills?: string[];
          parsed_experience_years?: number | null;
          uploaded_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          domain: string | null;
          logo_url: string | null;
          industry: string | null;
          size: string;
          description: string | null;
          headquarters: string | null;
          glassdoor_rating: number | null;
          glassdoor_url: string | null;
          known_sponsor: boolean;
          h1b_filings_count: number;
          tech_stack: string[];
          benefits: string[];
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          size?: string;
          description?: string | null;
          headquarters?: string | null;
          glassdoor_rating?: number | null;
          glassdoor_url?: string | null;
          known_sponsor?: boolean;
          h1b_filings_count?: number;
          tech_stack?: string[];
          benefits?: string[];
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          size?: string;
          description?: string | null;
          headquarters?: string | null;
          glassdoor_rating?: number | null;
          glassdoor_url?: string | null;
          known_sponsor?: boolean;
          h1b_filings_count?: number;
          tech_stack?: string[];
          benefits?: string[];
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string;
          seniority: string;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          skills_required: string[];
          skills_preferred: string[];
          location: string | null;
          is_remote: boolean;
          is_hybrid: boolean;
          visa_sponsorship_mentioned: boolean;
          visa_sponsorship_signals: string[];
          ai_summary: string | null;
          ai_red_flags: string[];
          ai_green_flags: string[];
          ai_culture_score: number | null;
          source: string;
          source_url: string | null;
          posted_at: string | null;
          expires_at: string | null;
          status: string;
          embedding: number[] | null;
          raw_html: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description: string;
          seniority?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          skills_required?: string[];
          skills_preferred?: string[];
          location?: string | null;
          is_remote?: boolean;
          is_hybrid?: boolean;
          visa_sponsorship_mentioned?: boolean;
          visa_sponsorship_signals?: string[];
          ai_summary?: string | null;
          ai_red_flags?: string[];
          ai_green_flags?: string[];
          ai_culture_score?: number | null;
          source: string;
          source_url?: string | null;
          posted_at?: string | null;
          expires_at?: string | null;
          status?: string;
          embedding?: number[] | null;
          raw_html?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          description?: string;
          seniority?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          skills_required?: string[];
          skills_preferred?: string[];
          location?: string | null;
          is_remote?: boolean;
          is_hybrid?: boolean;
          visa_sponsorship_mentioned?: boolean;
          visa_sponsorship_signals?: string[];
          ai_summary?: string | null;
          ai_red_flags?: string[];
          ai_green_flags?: string[];
          ai_culture_score?: number | null;
          source?: string;
          source_url?: string | null;
          posted_at?: string | null;
          expires_at?: string | null;
          status?: string;
          embedding?: number[] | null;
          raw_html?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      discoveries: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          overall_score: number;
          skill_score: number;
          experience_score: number;
          salary_score: number;
          location_score: number;
          visa_score: number;
          culture_score: number;
          vector_similarity: number;
          match_reason: string;
          user_action: string;
          discovery_source: string;
          seen_at: string | null;
          acted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          overall_score?: number;
          skill_score?: number;
          experience_score?: number;
          salary_score?: number;
          location_score?: number;
          visa_score?: number;
          culture_score?: number;
          vector_similarity?: number;
          match_reason?: string;
          user_action?: string;
          discovery_source?: string;
          seen_at?: string | null;
          acted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          overall_score?: number;
          skill_score?: number;
          experience_score?: number;
          salary_score?: number;
          location_score?: number;
          visa_score?: number;
          culture_score?: number;
          vector_similarity?: number;
          match_reason?: string;
          user_action?: string;
          discovery_source?: string;
          seen_at?: string | null;
          acted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      radar_configs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          keywords: string[];
          excluded_keywords: string[];
          title_patterns: string[];
          company_ids: string[];
          min_salary: number | null;
          remote_only: boolean;
          must_sponsor: boolean;
          locations: string[];
          industries: string[];
          frequency: string;
          is_active: boolean;
          last_run_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          keywords?: string[];
          excluded_keywords?: string[];
          title_patterns?: string[];
          company_ids?: string[];
          min_salary?: number | null;
          remote_only?: boolean;
          must_sponsor?: boolean;
          locations?: string[];
          industries?: string[];
          frequency?: string;
          is_active?: boolean;
          last_run_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          keywords?: string[];
          excluded_keywords?: string[];
          title_patterns?: string[];
          company_ids?: string[];
          min_salary?: number | null;
          remote_only?: boolean;
          must_sponsor?: boolean;
          locations?: string[];
          industries?: string[];
          frequency?: string;
          is_active?: boolean;
          last_run_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      radar_results: {
        Row: {
          id: string;
          radar_config_id: string;
          job_id: string;
          matched_keywords: string[];
          matched_at: string;
          notified: boolean;
          notified_at: string | null;
        };
        Insert: {
          id?: string;
          radar_config_id: string;
          job_id: string;
          matched_keywords?: string[];
          matched_at?: string;
          notified?: boolean;
          notified_at?: string | null;
        };
        Update: {
          id?: string;
          radar_config_id?: string;
          job_id?: string;
          matched_keywords?: string[];
          matched_at?: string;
          notified?: boolean;
          notified_at?: string | null;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          company_id: string;
          status: string;
          applied_at: string | null;
          response_at: string | null;
          next_step: string | null;
          next_step_date: string | null;
          salary_offered: number | null;
          notes: string;
          resume_id: string | null;
          cover_letter_url: string | null;
          referral_contact: string | null;
          timeline: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          company_id: string;
          status?: string;
          applied_at?: string | null;
          response_at?: string | null;
          next_step?: string | null;
          next_step_date?: string | null;
          salary_offered?: number | null;
          notes?: string;
          resume_id?: string | null;
          cover_letter_url?: string | null;
          referral_contact?: string | null;
          timeline?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          company_id?: string;
          status?: string;
          applied_at?: string | null;
          response_at?: string | null;
          next_step?: string | null;
          next_step_date?: string | null;
          salary_offered?: number | null;
          notes?: string;
          resume_id?: string | null;
          cover_letter_url?: string | null;
          referral_contact?: string | null;
          timeline?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      skill_assessments: {
        Row: {
          id: string;
          user_id: string;
          skill: string;
          category: string;
          self_rating: number;
          ai_rating: number | null;
          market_demand: number;
          job_prevalence: number;
          trend: string;
          assessed_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill: string;
          category: string;
          self_rating: number;
          ai_rating?: number | null;
          market_demand?: number;
          job_prevalence?: number;
          trend?: string;
          assessed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill?: string;
          category?: string;
          self_rating?: number;
          ai_rating?: number | null;
          market_demand?: number;
          job_prevalence?: number;
          trend?: string;
          assessed_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      visa_intelligence: {
        Row: {
          id: string;
          company_id: string;
          year: number;
          lca_filings: number;
          approvals: number;
          avg_salary: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          year: number;
          lca_filings?: number;
          approvals?: number;
          avg_salary?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          year?: number;
          lca_filings?: number;
          approvals?: number;
          avg_salary?: number | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
