create table public.skill_assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null,
  category text not null,
  self_rating integer not null check (self_rating between 1 and 5),
  ai_rating integer check (ai_rating between 1 and 5),
  market_demand integer not null default 0 check (market_demand between 0 and 100),
  job_prevalence integer not null default 0 check (job_prevalence between 0 and 100),
  trend text not null default 'stable'
    check (trend in ('rising', 'stable', 'declining')),
  assessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint skill_assessments_user_skill_unique unique (user_id, skill)
);

create trigger skill_assessments_updated_at
  before update on public.skill_assessments
  for each row execute function public.update_updated_at();
