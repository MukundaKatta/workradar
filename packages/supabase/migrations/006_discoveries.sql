create table public.discoveries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  overall_score integer not null default 0,
  skill_score integer not null default 0,
  experience_score integer not null default 0,
  salary_score integer not null default 0,
  location_score integer not null default 0,
  visa_score integer not null default 0,
  culture_score integer not null default 0,
  vector_similarity real not null default 0,
  match_reason text not null default '',
  user_action text not null default 'unseen'
    check (user_action in ('unseen', 'seen', 'saved', 'applied', 'dismissed', 'not_interested')),
  discovery_source text not null default 'matcher',
  seen_at timestamptz,
  acted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint discoveries_user_job_unique unique (user_id, job_id)
);

create trigger discoveries_updated_at
  before update on public.discoveries
  for each row execute function public.update_updated_at();
