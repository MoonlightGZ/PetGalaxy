-- PetGalaxy Supabase schema with auth-scoped RLS and storage-ready ownership.
create extension if not exists "pgcrypto";

create type public.pet_species as enum ('Dog', 'Cat', 'Bird', 'Reptile', 'Amphibian', 'Small Mammal', 'Exotic');
create type public.timeline_category as enum ('vaccine', 'surgery', 'diagnostic', 'medication', 'visit', 'note');
create type public.document_status as enum ('uploaded', 'processing', 'needs_review', 'complete', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  species public.pet_species not null,
  breed text,
  species_detail text,
  color_markings text,
  date_of_birth date,
  sex text check (sex in ('Female', 'Male', 'Unknown')) default 'Unknown',
  spayed_neutered boolean default false,
  microchip_number text check (microchip_number is null or microchip_number ~ '^\d{15}$'),
  weight numeric(8,2),
  care_notes text,
  primary_photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pet_media (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  storage_path text not null,
  caption text,
  media_kind text not null default 'photo',
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete set null,
  file_name text not null,
  storage_path text not null,
  mime_type text not null,
  status public.document_status not null default 'uploaded',
  extracted_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.timeline_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  category public.timeline_category not null,
  title text not null,
  occurred_on date not null,
  next_due_on date,
  provider_name text,
  manufacturer text,
  batch_number text,
  technician text,
  dosage text,
  frequency text,
  qualitative_results text,
  values_json jsonb not null default '{}'::jsonb,
  notes text,
  dedupe_key text,
  created_at timestamptz not null default now(),
  unique (owner_id, dedupe_key)
);

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.pet_media enable row level security;
alter table public.documents enable row level security;
alter table public.timeline_records enable row level security;

create policy "profiles are self-owned" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "pets are owner scoped" on public.pets for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "media is owner scoped" on public.pet_media for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "documents are owner scoped" on public.documents for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "timeline is owner scoped" on public.timeline_records for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index on public.pets(owner_id);
create index on public.documents(owner_id, status);
create index on public.timeline_records(owner_id, pet_id, occurred_on desc);
