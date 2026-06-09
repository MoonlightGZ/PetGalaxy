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

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
npm audit
```
