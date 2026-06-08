# PetGalaxy

PetGalaxy is a premium pet owner medical hub and portal for centralized records, AI-assisted document extraction, reminders, media, and clinic-grade PDF exports.

## Stack

- Next.js 15 App Router with TypeScript
- Tailwind CSS 4 and shadcn/ui-inspired local primitives
- Framer Motion animations
- React Hook Form and Zod-ready validation schemas
- Supabase Auth, PostgreSQL, RLS, realtime-ready tables, and Storage-ready paths
- AI extraction provider abstraction for OpenAI, Anthropic, and Google Gemini

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable live Supabase email/password and Google OAuth authentication. Apply `supabase/schema.sql` in your Supabase SQL editor to create the owner-scoped tables and row-level security policies.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```
=======
PetGalaxy is an ultra-modern, fully private, and decentralized pet health companion designed to rescue pet owners from chaotic paperwork, fragmented vet portals, and locked shelter ecosystems. Built for seamless synchronization across desktop PCs and mobile web browsers, PetGalaxy puts 100% of your pet’s historical medical data back into your hands!
