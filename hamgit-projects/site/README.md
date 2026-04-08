# Project Overview

Amline Site - A Next.js 15 static site for a real estate platform (املاین). The site is built with React 19, TypeScript, and Tailwind CSS, configured for static export and served via Nginx.

## Key Commands

### Development

```bash
pnpm dev              # Start development server on port 3002 with Turbopack
pnpm build            # Build static site for production (outputs to /out)
pnpm start            # Start production server on port 3002
pnpm lint             # Run ESLint
```

### Package Management

This project uses **pnpm** exclusively. Do not use npm or yarn.

### Git Hooks

Husky is configured to run `pnpm lint` on pre-commit.

## Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router (static export mode)
- **React**: v19
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS v4 with custom Prettier plugin
- **UI Components**: Radix UI primitives + shadcn/ui
- **HTTP Client**: Axios
- **Fonts**: Local IranSansX font family
- **Deployment**: Static build served via Nginx (Dockerized)

### Project Structure

```bash
src/
├── app/                    # Next.js App Router
│   ├── (landings)/        # Route group for landing pages (rent, realtor)
│   ├── about/             # About page
│   ├── licenses/          # Licenses page
│   ├── layout.tsx         # Root layout with RTL, Persian locale
│   └── providers.tsx      # React Query provider setup
├── features/              # Feature-based modules
│   ├── home/             # Home page feature (Hero, Features, etc.)
│   └── landing/          # Landing page features (Rent, Realtor)
│       ├── api/          # Feature-specific API calls
│       ├── assets/       # Feature-specific assets
│       ├── components/   # Feature-specific components
│       ├── pages/        # Page-level components
│       └── queries/      # React Query hooks
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Header, Footer
│   └── third-party/      # Third-party widgets (Goftino, etc.)
├── lib/
│   ├── http-api.ts       # Axios instance for API calls
│   ├── react-query.ts    # Query keys factory
│   ├── utils.ts          # cn() utility for className merging
│   └── wp-client.ts      # WordPress API client
├── config/
│   └── env.ts            # Environment variables typed config
├── hooks/                # Shared React hooks
├── types/                # TypeScript type definitions
└── assets/
    ├── fonts/            # Local font files
    ├── icons/            # SVG icons
    └── images/           # Image assets
```

### Key Architectural Patterns

1. **Feature-Based Organization**: Features are self-contained modules with their own components, API calls, queries, and assets. Each feature exports components through an `index.ts` barrel file.

2. **Import Restrictions**: ESLint enforces no deep imports from feature internals (`@/features/*/*`). Always import from feature index files.

3. **No Default Exports**: Default exports are prohibited except in:
   - Next.js App Router files (`src/app/**`)
   - Config files (`*config.{js,ts,cjs,mjs}`)

4. **Path Aliases**: `@/*` resolves to `src/*`

5. **Static Site Generation**: Project uses `output: 'export'` for static HTML generation. No server-side runtime features (API routes, middleware, ISR, etc.).

6. **RTL Layout**: Site is configured for Persian (Farsi) with `dir="rtl"` and `lang="fa"`.

7. **React Query Configuration**:
   - `staleTime`: 60 seconds
   - `gcTime`: 5 minutes
   - Auto-retry: 1 for queries, 0 for mutations
   - No refetch on window focus

### Environment Variables

Required environment variables (defined in `.env`):

- `NEXT_PUBLIC_BASE_URL` - Main site URL
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_BLOG_URL` - WordPress blog URL
- `NEXT_PUBLIC_API_URL` - Backend API URL

Access via `@/config/env` (typed).

### Blog (`/blog`) Integration

- `/blog` is served by a separate WordPress instance that sits behind the same Nginx layer as the static Next.js export. Nginx proxies any `/blog` requests to PHP-FPM (or the upstream container) that runs WordPress, while other paths are served from the static `out/` directory.
- WordPress handles all routing, post management, and plugins for the blog. Elementor powers the custom theming/layouts, so any visual tweaks for the blog are made inside Elementor rather than this repository.
- The main site links to the blog via `NEXT_PUBLIC_BLOG_URL`; no blog assets or templates live inside this codebase.

### Code Style

- **Prettier**: 100 char line width, single quotes, no semicolons, arrow parens avoid
- **ESLint**: Warns on `console.log` (allows `console.warn`/`error`), prohibits unused vars (except prefixed with `_`)
- **Tailwind**: Uses Prettier plugin for class sorting

### UI Components

Built on shadcn/ui (New York style) with Radix UI primitives. Add new components via:

```bash
npx shadcn@latest add <component-name>
```

### Deployment

Dockerfile multi-stage build:

1. Build stage: Node 20 Alpine, pnpm, creates static export in `/out`
2. Production stage: Nginx 1.29.1, serves static files

Custom Nginx config at `.nginx/nginx.conf`.

## Important Notes

- **Language**: UI and content are in Persian (Farsi)
- **Images**: Unoptimized for static export
- **Testing**: No test framework currently configured
- **TypeScript**: Strict mode enabled
- **Route Groups**: `(landings)` group organizes marketing pages without affecting URLs
