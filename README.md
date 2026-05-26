# BuildIt

Tradesman platform for small businesses — showcase work in progress, manage your business, find new customers.

## Stack

- **Next.js 15** — App Router, Server Components
- **TypeScript** — strict mode
- **PostgreSQL** + **Prisma ORM**
- **Tailwind CSS**
- **NextAuth.js v5** — Google OAuth + email/password
- **Vitest** — unit testing

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd buildit
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and OAuth credentials

# 3. Set up the database
npm run db:migrate

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:push` | Push schema changes (dev only) |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
  app/                 # Next.js App Router routes
    (marketing)/       # Public pages (landing, about)
    (dashboard)/       # Authenticated dashboard
    api/               # API routes
  features/            # Feature modules
    auth/              # Authentication logic
    business/          # Business profiles
    projects/          # Work showcase
    quotes/            # Quote management
    invoices/          # Invoice management
    reviews/           # Customer reviews
  lib/                 # Shared utilities
    prisma.ts          # Prisma client singleton
    auth.ts            # NextAuth config
  test/                # Test utilities and setup
prisma/
  schema.prisma        # Database schema
```

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for JWT signing (min 32 chars) |
| `NEXTAUTH_URL` | Base URL of the app |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

## Production Deployment

The app deploys to **Vercel** (Sydney region) backed by **Supabase PostgreSQL** (`ap-southeast-2`).

### Supabase project

Project ref: `jbrsbylfjjzbzqnqingm`  
Dashboard: https://supabase.com/dashboard/project/jbrsbylfjjzbzqnqingm

Migrations are already applied. The connection string is available at:  
**Supabase Dashboard → Project Settings → Database → Connection string (Transaction pooler)**

### Deploying to Vercel

1. Go to https://vercel.com/new and import `simon-angelus/buildit` from GitHub.
2. Set these environment variables in Vercel:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Supabase pooler URL (Transaction mode, port 6543) |
| `NEXTAUTH_SECRET` | `1doJuBNyygWgSELaqGDdII2FBlYnqEOPMPWfdTzfcX4` |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://buildit.vercel.app`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional — email/password auth works without it) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for photo uploads |
| `RESEND_API_KEY` | Resend API key for email notifications (optional) |

3. Click **Deploy** — Vercel auto-deploys on every push to `main`.

### GitHub repo

https://github.com/simon-angelus/buildit

## CI

GitHub Actions runs on every PR to `main`:
- ESLint
- TypeScript type-check
- Vitest unit tests
