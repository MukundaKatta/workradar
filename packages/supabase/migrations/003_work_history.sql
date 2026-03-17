create table public.work_history (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  title text not null,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  description text,
  skills_used text[] not null default '{}',
  achievements text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger work_history_updated_at
  before update on public.work_history
  for each row execute function public.update_updated_at();

create table public.resumes (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  parsed_text text,
  parsed_skills text[] not null default '{}',
  parsed_experience_years integer,
  uploaded_at timestamptz not null default now()
);
