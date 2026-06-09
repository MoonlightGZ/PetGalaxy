# PetGalaxy

PetGalaxy is a simple static HTML/CSS/JavaScript demo of a modern pet owner medical hub. It uses only browser-native files and does not require a build step, framework, backend, authentication provider, database, or package installation.

## Files

- `index.html` — page structure and content for the PetGalaxy landing/dashboard demo.
- `styles.css` — responsive glassmorphism UI, black/white/blue/light-purple palette, dark mode, and animations.
- `script.js` — mock pet, timeline, document vault, theme toggle, mobile navigation, and demo interactions.

## Run

Open `index.html` directly in any modern browser.

For a local static server, you can also run:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.
=======
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
