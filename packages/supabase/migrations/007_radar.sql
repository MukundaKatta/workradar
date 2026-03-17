create table public.radar_configs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  keywords text[] not null default '{}',
  excluded_keywords text[] not null default '{}',
  title_patterns text[] not null default '{}',
  company_ids uuid[] not null default '{}',
  min_salary integer,
  remote_only boolean not null default false,
  must_sponsor boolean not null default false,
  locations text[] not null default '{}',
  industries text[] not null default '{}',
  frequency text not null default 'daily'
    check (frequency in ('realtime', 'hourly', 'daily', 'weekly')),
  is_active boolean not null default true,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger radar_configs_updated_at
  before update on public.radar_configs
  for each row execute function public.update_updated_at();

create table public.radar_results (
  id uuid primary key default uuid_generate_v4(),
  radar_config_id uuid not null references public.radar_configs(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  matched_keywords text[] not null default '{}',
  matched_at timestamptz not null default now(),
  notified boolean not null default false,
  notified_at timestamptz,

  constraint radar_results_config_job_unique unique (radar_config_id, job_id)
);
