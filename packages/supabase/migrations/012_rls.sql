-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.work_history enable row level security;
alter table public.resumes enable row level security;
alter table public.companies enable row level security;
alter table public.jobs enable row level security;
alter table public.discoveries enable row level security;
alter table public.radar_configs enable row level security;
alter table public.radar_results enable row level security;
alter table public.applications enable row level security;
alter table public.skill_assessments enable row level security;
alter table public.visa_intelligence enable row level security;

-- ─── Profiles ────────────────────────────────────────────────

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- ─── Work History ────────────────────────────────────────────

create policy "Users can view their own work history"
  on public.work_history for select
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "Users can insert their own work history"
  on public.work_history for insert
  with check (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "Users can update their own work history"
  on public.work_history for update
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "Users can delete their own work history"
  on public.work_history for delete
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

-- ─── Resumes ─────────────────────────────────────────────────

create policy "Users can view their own resumes"
  on public.resumes for select
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (profile_id in (
    select id from public.profiles where user_id = auth.uid()
  ));

-- ─── Companies (public read, service-role write) ─────────────

create policy "Anyone can view companies"
  on public.companies for select
  using (true);

-- ─── Jobs (public read, service-role write) ──────────────────

create policy "Anyone can view active jobs"
  on public.jobs for select
  using (true);

-- ─── Discoveries ─────────────────────────────────────────────

create policy "Users can view their own discoveries"
  on public.discoveries for select
  using (auth.uid() = user_id);

create policy "Users can update their own discoveries"
  on public.discoveries for update
  using (auth.uid() = user_id);

-- Service role handles inserts during matching

-- ─── Radar Configs ───────────────────────────────────────────

create policy "Users can view their own radar configs"
  on public.radar_configs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own radar configs"
  on public.radar_configs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own radar configs"
  on public.radar_configs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own radar configs"
  on public.radar_configs for delete
  using (auth.uid() = user_id);

-- ─── Radar Results ───────────────────────────────────────────

create policy "Users can view their own radar results"
  on public.radar_results for select
  using (radar_config_id in (
    select id from public.radar_configs where user_id = auth.uid()
  ));

-- ─── Applications ────────────────────────────────────────────

create policy "Users can view their own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- ─── Skill Assessments ──────────────────────────────────────

create policy "Users can view their own skill assessments"
  on public.skill_assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own skill assessments"
  on public.skill_assessments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own skill assessments"
  on public.skill_assessments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own skill assessments"
  on public.skill_assessments for delete
  using (auth.uid() = user_id);

-- ─── Visa Intelligence (public read) ─────────────────────────

create policy "Anyone can view visa intelligence"
  on public.visa_intelligence for select
  using (true);
