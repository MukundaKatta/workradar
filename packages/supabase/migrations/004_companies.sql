create table public.companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  domain text,
  logo_url text,
  industry text,
  size text not null default 'medium_51_200',
  description text,
  headquarters text,
  glassdoor_rating numeric(2,1),
  glassdoor_url text,
  known_sponsor boolean not null default false,
  h1b_filings_count integer not null default 0,
  tech_stack text[] not null default '{}',
  benefits text[] not null default '{}',
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint companies_domain_unique unique (domain)
);

create trigger companies_updated_at
  before update on public.companies
  for each row execute function public.update_updated_at();
