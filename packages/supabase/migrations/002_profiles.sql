create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  desired_roles text[] not null default '{}',
  seniority text not null default 'mid',
  salary_min integer,
  salary_max integer,
  salary_currency text not null default 'USD',
  location_preferences jsonb not null default '[]',
  remote_preference text not null default 'flexible'
    check (remote_preference in ('remote', 'hybrid', 'onsite', 'flexible')),
  visa_status text not null default 'not_applicable',
  needs_sponsorship boolean not null default false,
  skills text[] not null default '{}',
  industries text[] not null default '{}',
  company_size_preference text[] not null default '{}',
  culture_values text[] not null default '{}',
  deal_breakers text[] not null default '{}',
  years_of_experience integer not null default 0,
  education_level text,
  onboarding_completed boolean not null default false,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_user_id_unique unique (user_id)
);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();
