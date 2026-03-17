create table public.jobs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  seniority text not null default 'mid',
  salary_min integer,
  salary_max integer,
  salary_currency text not null default 'USD',
  skills_required text[] not null default '{}',
  skills_preferred text[] not null default '{}',
  location text,
  is_remote boolean not null default false,
  is_hybrid boolean not null default false,
  visa_sponsorship_mentioned boolean not null default false,
  visa_sponsorship_signals text[] not null default '{}',
  ai_summary text,
  ai_red_flags text[] not null default '{}',
  ai_green_flags text[] not null default '{}',
  ai_culture_score integer,
  source text not null,
  source_url text,
  posted_at timestamptz,
  expires_at timestamptz,
  status text not null default 'active'
    check (status in ('active', 'closed', 'expired')),
  embedding vector(1536),
  raw_html text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.update_updated_at();
