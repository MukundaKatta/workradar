create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  status text not null default 'interested'
    check (status in (
      'interested', 'applying', 'applied', 'screening',
      'phone_screen', 'technical', 'onsite', 'offer',
      'accepted', 'rejected', 'withdrawn', 'ghosted'
    )),
  applied_at timestamptz,
  response_at timestamptz,
  next_step text,
  next_step_date timestamptz,
  salary_offered integer,
  notes text not null default '',
  resume_id uuid references public.resumes(id) on delete set null,
  cover_letter_url text,
  referral_contact text,
  timeline jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint applications_user_job_unique unique (user_id, job_id)
);

create trigger applications_updated_at
  before update on public.applications
  for each row execute function public.update_updated_at();
