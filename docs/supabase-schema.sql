create extension if not exists pgcrypto;

create table if not exists profiles (
  id text primary key,
  display_name text not null,
  updated_at timestamptz not null default now()
);

alter table if exists profiles
  add column if not exists is_profile_public boolean not null default true;

alter table if exists profiles
  add column if not exists public_contact_email text;

alter table if exists profiles
  add column if not exists is_contact_email_public boolean not null default false;

create table if not exists auth_accounts (
  id text primary key references profiles(id) on delete cascade,
  email text not null unique,
  password_salt text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists auth_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id text not null references auth_accounts(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists hackathon_favorites (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null references profiles(id) on delete cascade,
  hackathon_slug text not null,
  created_at timestamptz not null default now(),
  unique (visitor_id, hackathon_slug)
);

create table if not exists camp_teams (
  id uuid primary key default gen_random_uuid(),
  hackathon_slug text,
  name text not null,
  intro text not null,
  looking_for text[] not null default '{}',
  target_member_count integer not null default 4,
  recruitment_deadline_at timestamptz,
  contact_url text,
  is_open boolean not null default true,
  owner_id text not null references profiles(id) on delete cascade,
  owner_name text not null,
  member_count integer not null default 1,
  created_at timestamptz not null default now()
);

alter table if exists camp_teams
  add column if not exists target_member_count integer not null default 4;

alter table if exists camp_teams
  add column if not exists recruitment_deadline_at timestamptz;

create table if not exists team_messages (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references camp_teams(id) on delete cascade,
  visitor_id text not null references profiles(id) on delete cascade,
  visitor_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists hackathon_submissions (
  id uuid primary key default gen_random_uuid(),
  hackathon_slug text not null,
  visitor_id text not null references profiles(id) on delete cascade,
  visitor_name text not null,
  project_title text not null,
  team_participants text not null,
  service_overview text,
  page_composition text,
  system_composition text,
  core_function_spec text,
  user_flow text,
  development_plan text,
  created_at timestamptz not null default now()
);

create index if not exists idx_camp_teams_hackathon_slug on camp_teams (hackathon_slug);
create index if not exists idx_camp_teams_owner_id on camp_teams (owner_id);
create index if not exists idx_auth_accounts_email on auth_accounts (email);
create index if not exists idx_auth_sessions_account_id on auth_sessions (account_id);
create index if not exists idx_auth_sessions_expires_at on auth_sessions (expires_at);
create index if not exists idx_team_messages_team_id_created_at on team_messages (team_id, created_at);
create index if not exists idx_hackathon_submissions_hackathon_slug on hackathon_submissions (hackathon_slug);
create index if not exists idx_hackathon_submissions_visitor_id on hackathon_submissions (visitor_id);
