create table public.visa_intelligence (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  year integer not null,
  lca_filings integer not null default 0,
  approvals integer not null default 0,
  avg_salary integer,
  created_at timestamptz not null default now(),

  constraint visa_intelligence_company_year_unique unique (company_id, year)
);
