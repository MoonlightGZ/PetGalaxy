# PetGalaxy

PetGalaxy is a pet owner medical hub for private pet profiles, document storage, medical timelines, and clinic-ready PDF exports.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS 4 and local UI primitives
- Supabase Auth, PostgreSQL row-level security, and private Storage
- jsPDF for client-side medical history exports

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure these values in `.env.local` and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Apply `supabase/schema.sql` in the Supabase SQL editor before using the app. The schema creates owner-scoped tables, a profile creation trigger, and private Storage policies for uploaded pet documents.

### Google OAuth Setup

To enable the Google sign-in/sign-up button:

1. In Supabase, open **Authentication > Providers > Google** and enable the provider.
2. In Google Cloud Console, create an OAuth client and add your Supabase redirect URLs.
3. Add the client ID and client secret to Supabase.
4. Make sure your local and production callback URLs are allowed, including `/auth/callback` for this app.

If Google is not enabled, PetGalaxy will now show a clean setup message instead of a raw OAuth error.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
npm audit
```
