-- Vector similarity indexes (ivfflat)
create index idx_profiles_embedding on public.profiles
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index idx_jobs_embedding on public.jobs
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index idx_companies_embedding on public.companies
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- GIN indexes for array containment queries
create index idx_profiles_skills on public.profiles using gin (skills);
create index idx_profiles_industries on public.profiles using gin (industries);
create index idx_profiles_desired_roles on public.profiles using gin (desired_roles);
create index idx_profiles_culture_values on public.profiles using gin (culture_values);

create index idx_jobs_skills_required on public.jobs using gin (skills_required);
create index idx_jobs_skills_preferred on public.jobs using gin (skills_preferred);
create index idx_jobs_ai_red_flags on public.jobs using gin (ai_red_flags);
create index idx_jobs_ai_green_flags on public.jobs using gin (ai_green_flags);
create index idx_jobs_visa_signals on public.jobs using gin (visa_sponsorship_signals);

create index idx_companies_tech_stack on public.companies using gin (tech_stack);
create index idx_companies_benefits on public.companies using gin (benefits);

create index idx_radar_configs_keywords on public.radar_configs using gin (keywords);

-- GIN trigram indexes for text search
create index idx_jobs_title_trgm on public.jobs using gin (title extensions.gin_trgm_ops);
create index idx_jobs_description_trgm on public.jobs using gin (description extensions.gin_trgm_ops);
create index idx_companies_name_trgm on public.companies using gin (name extensions.gin_trgm_ops);

-- B-tree indexes for common lookups
create index idx_profiles_user_id on public.profiles (user_id);
create index idx_profiles_seniority on public.profiles (seniority);
create index idx_profiles_needs_sponsorship on public.profiles (needs_sponsorship) where needs_sponsorship = true;

create index idx_work_history_profile_id on public.work_history (profile_id);
create index idx_resumes_profile_id on public.resumes (profile_id);

create index idx_jobs_company_id on public.jobs (company_id);
create index idx_jobs_status on public.jobs (status);
create index idx_jobs_seniority on public.jobs (seniority);
create index idx_jobs_is_remote on public.jobs (is_remote) where is_remote = true;
create index idx_jobs_visa_sponsorship on public.jobs (visa_sponsorship_mentioned) where visa_sponsorship_mentioned = true;
create index idx_jobs_posted_at on public.jobs (posted_at desc);
create index idx_jobs_salary_range on public.jobs (salary_min, salary_max) where salary_min is not null;

create index idx_discoveries_user_id on public.discoveries (user_id);
create index idx_discoveries_job_id on public.discoveries (job_id);
create index idx_discoveries_user_action on public.discoveries (user_id, user_action);
create index idx_discoveries_overall_score on public.discoveries (user_id, overall_score desc);

create index idx_radar_configs_user_id on public.radar_configs (user_id);
create index idx_radar_configs_active on public.radar_configs (is_active, frequency) where is_active = true;
create index idx_radar_results_config_id on public.radar_results (radar_config_id);
create index idx_radar_results_job_id on public.radar_results (job_id);

create index idx_applications_user_id on public.applications (user_id);
create index idx_applications_status on public.applications (user_id, status);
create index idx_applications_company_id on public.applications (company_id);
create index idx_applications_next_step_date on public.applications (next_step_date) where next_step_date is not null;

create index idx_skill_assessments_user_id on public.skill_assessments (user_id);
create index idx_skill_assessments_trend on public.skill_assessments (trend);

create index idx_visa_intelligence_company_id on public.visa_intelligence (company_id);
create index idx_visa_intelligence_year on public.visa_intelligence (year desc);

-- Composite index for known sponsors
create index idx_companies_known_sponsor on public.companies (known_sponsor, h1b_filings_count desc) where known_sponsor = true;
