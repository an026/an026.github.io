# Setup

This site is a static Next.js export (deploys to GitHub Pages) backed by
[Supabase](https://supabase.com) for the database, admin auth, and photo
storage. There's no server to run — the static site talks to Supabase
directly over HTTPS using a public (anon) API key.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project. Free tier is fine.
2. Once it's up, open **SQL Editor** → New query, paste the contents of
   [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates all
   tables, row-level-security policies, the `media` storage bucket, and seeds
   one placeholder project/note so the site isn't empty.

## 2. Create your admin account

There are no public sign-ups — you're the only user.

1. **Authentication → Settings** → turn **off** "Allow new users to sign up".
2. **Authentication → Users** → Add user → enter your own email + a strong
   password. This is what you'll use to log into `/admin`.

## 3. Get your API keys

**Project Settings → API**. You need:
- **Project URL**
- **anon / public key** (not the `service_role` key — that one must never
  ship to the browser)

## 4. Configure the app

Copy `.env.example` to `.env.local` and fill in the two values above:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
```

`NEXT_PUBLIC_ADMIN_EMAIL` must match the email you used in step 2. The
`/admin` screen only shows a single passcode field (matching the design) —
it signs in to Supabase with this email plus whatever you type, behind the
scenes.

Then:

```
npm install
npm run dev
```

Visit `http://localhost:3000`, and `http://localhost:3000/admin` to log in
with the email/password you created in step 2.

## 5. Deploy to GitHub Pages

- If this repo is `an026/an026.github.io` (a **user site**), it deploys to
  the domain root — leave `NEXT_PUBLIC_BASE_PATH` unset.
- If it's a **project site** (any other repo name), GitHub Pages serves it
  at `/<repo-name>/`, so set the repo variable/secret
  `NEXT_PUBLIC_BASE_PATH` to `/<repo-name>` (see the GitHub Actions workflow
  at `.github/workflows/deploy.yml`).

In the repo's **Settings → Secrets and variables → Actions**, add these as
**repository variables** (not secrets — they're all meant to end up in the
public JS bundle, so the "secrets" masking isn't needed and would just make
them harder to debug in logs):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `NEXT_PUBLIC_BASE_PATH` (only for a project page, per above)

Then in **Settings → Pages**, set the source to **GitHub Actions**. Pushing
to `main` runs `.github/workflows/deploy.yml`, which builds the static
export and publishes it.

## Notes on this architecture

- **Auth**: real, server-side-enforced via Supabase Auth (email+password).
  The password is never shipped in client code; Supabase issues a session
  token after verifying it against their servers. Row Level Security (see
  `supabase/schema.sql`) means write access to content tables is enforced by
  the database itself, not just hidden in the UI.
- **Media**: photo uploads (About photo, project demo photo, inline post
  images) go to a public Supabase Storage bucket. Raw video upload isn't
  supported (by design, to avoid large-file/quota issues) — project demos
  can use an uploaded photo or a YouTube link instead.
- **Comments** are public and unauthenticated by design (anyone can leave a
  named comment, matching a personal-blog feel) — moderation (delete) is
  reserved for the signed-in admin.
