-- Allison Vu portfolio — Supabase schema
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: uses "if not exists" / "or replace" throughout.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tags: the shared taxonomy for note topics and project categories.
-- ---------------------------------------------------------------------------
create table if not exists topics (
  name text primary key
);

create table if not exists categories (
  name text primary key
);

insert into categories (name) values ('web'), ('systems'), ('tools')
  on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Posts (Writing)
-- ---------------------------------------------------------------------------
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  topic text not null default 'Notes',
  date text not null default 'Draft',
  reading_time text not null default '1 min',
  excerpt text not null default '',
  body text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Comments (public, named — no accounts)
-- ---------------------------------------------------------------------------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null references posts(slug) on delete cascade,
  name text not null default 'anonymous',
  text text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  year text not null default '2026',
  category text not null default 'web',
  featured boolean not null default false,
  description text not null default '',
  tags text[] not null default '{}',
  repo text not null default '',
  demo text not null default '',
  duration text not null default '0:30',
  overview text[] not null default '{}',
  highlights text[] not null default '{}',
  media_type text check (media_type in ('photo', 'youtube')),
  media_src text,
  sort_index int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Experience (the "Work" tab)
-- ---------------------------------------------------------------------------
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  period text not null default '',
  role text not null default '',
  org text not null default '',
  description text not null default '',
  tags text[] not null default '{}',
  sort_index int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- About (singleton row)
-- ---------------------------------------------------------------------------
create table if not exists about (
  id int primary key default 1 check (id = 1),
  bio1 text not null default '',
  bio2 text not null default '',
  currently text not null default '',
  location text not null default '',
  email text not null default '',
  photo_url text,
  photo_caption text not null default ''
);

insert into about (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public (anon) can read everything and post comments. Only a signed-in
-- admin (there is exactly one — see SETUP.md) can write content.
-- ---------------------------------------------------------------------------
alter table topics enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;
alter table about enable row level security;

drop policy if exists "public read topics" on topics;
create policy "public read topics" on topics for select using (true);
drop policy if exists "admin write topics" on topics;
create policy "admin write topics" on topics for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read posts" on posts;
create policy "public read posts" on posts for select using (true);
drop policy if exists "admin write posts" on posts;
create policy "admin write posts" on posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read comments" on comments;
create policy "public read comments" on comments for select using (true);
drop policy if exists "public insert comments" on comments;
create policy "public insert comments" on comments for insert with check (true);
drop policy if exists "admin moderate comments" on comments;
create policy "admin moderate comments" on comments for delete using (auth.role() = 'authenticated');
drop policy if exists "admin update comments" on comments;
create policy "admin update comments" on comments for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read projects" on projects;
create policy "public read projects" on projects for select using (true);
drop policy if exists "admin write projects" on projects;
create policy "admin write projects" on projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read experience" on experience;
create policy "public read experience" on experience for select using (true);
drop policy if exists "admin write experience" on experience;
create policy "admin write experience" on experience for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public read about" on about;
create policy "public read about" on about for select using (true);
drop policy if exists "admin write about" on about;
create policy "admin write about" on about for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Seed content — one placeholder project + one placeholder note, matching
-- the site's current "clean slate" state. Edit/replace from /admin.
-- ---------------------------------------------------------------------------
insert into projects (slug, title, year, category, featured, description, tags, repo, demo, duration, overview, highlights, sort_index)
values (
  'try-on-ai', 'try-on.ai', '2025', 'web', true,
  'A web app that lets users upload selfies and virtually try on outfits using Google''s Nano Banana AI model.',
  array['Next.js', 'TypeScript', 'React.js', 'FastAPI'],
  'https://devpost.com/software/tryon-ai-5lbjct',
  'https://devpost.com/software/tryon-ai-5lbjct',
  'Oct 2025 – Oct 2025',
  array['try-on.ai lets users upload a selfie and see themselves wearing different outfits, powered by Google''s Nano Banana AI model.'],
  array[
    'Developed a web app enabling users to upload selfies and virtually try outfits with Google''s Nano Banana AI model',
    'Designed and implemented an interactive landing page with animations and typewriter effects using React.js and Tailwind CSS, driving an engaging first-impression for users',
    'Built the Outfit Swapping interface with Next.js, TypeScript, and React.js, allowing users to browse clothing options and dynamically render AI-generated try-on images via FastAPI',
    'Collaborated with backend teammates to fix FastAPI routes, improving reliability of AI–frontend communication'
  ],
  1
) on conflict (slug) do nothing;

insert into posts (slug, title, topic, date, reading_time, excerpt, body)
values (
  'placeholder-note', 'New note', 'Notes', 'Draft', '1 min',
  'Add a real note here from the admin panel.',
  'This is a placeholder note. Edit it from the admin panel to write something real.'
) on conflict (slug) do nothing;

insert into experience (period, role, org, description, tags, sort_index) values
  ('June 2026 — August 2026', 'Software Engineering Intern', 'Raymond James Financial',
   E'Built a Spring Boot bulk-update REST API enabling financial advisors to reallocate fee responsibility across all Raymond James countries, branches, and offices\nDesigned a chunked-batching strategy with independent commit/rollback per batch to balance data consistency with fault isolation\nReplaced a manual single-record workflow, cutting a multi-step process down to a single bulk action',
   array['Spring Boot', 'Java', 'REST API'], 3),
  ('May 2025 — October 2025', 'Software Engineering Intern', 'Quant Data',
   E'Designed and implemented a landing page redesign with React, Next.js, and TypeScript\nImproved usability and visual consistency across the site\nCollaborated with engineers and designers to integrate frontend components into the broader platform, ensuring seamless functionality and responsive performance',
   array['React', 'Next.js', 'TypeScript'], 2),
  ('August 2024 — December 2025', 'Lead Teaching Assistant for Software Engineering', 'Georgia Institute of Technology',
   E'Mentored and guided 350+ students in a semester-long web development course covering HTML, CSS, React, Django, Firebase, and Python\nFacilitated Agile and Scrum practices by introducing students to Jira and Trello\nEnsured project teams iterated effectively and delivered functional web applications on schedule',
   array['React', 'Django', 'Firebase'], 1)
on conflict do nothing;

update about set
  bio1 = 'I''m a software engineer who likes building AI-powered products and clean, full-stack web apps. Most of my work lives at the intersection of frontend polish and backend reliability — landing pages that feel alive, APIs that don''t fall over.',
  bio2 = 'When something surprises me, I write it down. That''s how this site started: a well-kept README that grew a few extra pages. Monospace, all the way down.',
  currently = 'SWE Intern @ Raymond James',
  location = 'Atlanta, GA',
  email = 'allisonvu.swe@gmail.com',
  photo_caption = 'Allison Vu'
where id = 1 and bio1 = '';

insert into topics (name) values ('Notes') on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Storage: a public "media" bucket for admin-uploaded photos (project demo
-- photos, the About photo, inline post images). Anyone can view; only a
-- signed-in admin can upload/replace/delete.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated')
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
