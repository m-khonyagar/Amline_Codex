# Project Overview

This is a Next.js application called "amline" - a real estate/property management platform with features for contracts, ads, chat, invoicing, and payments. The app uses the Pages Router, React Query for data fetching, Tailwind CSS for styling, and Storybook for component development.

## Development Commands

### Running the Application

```bash
# Start development server
npm run dev

# Start development server accessible on network (0.0.0.0)
npm run dev:network

# Production build
npm run build

# Start production server
npm start
```

### Code Quality & Formatting

```bash
# Run ESLint (executes on pre-commit via Husky)
npm run lint

# Format code with Prettier
npm run format
```

### Storybook

```bash
# Start Storybook development server on port 6006
npm run storybook

# Build Storybook static site
npm run build-storybook
```

### Bundle Analysis

```bash
# Analyze bundle size with webpack bundle analyzer
npm run analyze
```

## Architecture

### Directory Structure

```bash
src/
├── app/              # App-level configuration and setup
├── assets/           # Static assets (styles, images, fonts)
├── components/       # Shared/common components
│   ├── ui/          # UI component library (Button, Input, Modal, etc.)
│   └── icons/       # Icon components
├── configs/          # Configuration files (runtime config)
├── data/             # Data layer
│   ├── api/         # API endpoint functions (auth.js, contract.js, etc.)
│   ├── enums/       # Enumerations and constants
│   └── services/    # HTTP client and request handlers
├── features/         # Feature-based modules
│   ├── auth/
│   ├── contract/
│   ├── ads/
│   ├── chat/
│   ├── wallet/
│   └── ...
├── hooks/            # Custom React hooks
├── pages/            # Next.js pages (Pages Router)
│   ├── api/         # API routes
│   ├── _app.jsx     # Custom App component
│   └── _document.jsx # Custom Document
└── utils/            # Utility functions
```

### Feature Module Structure

Features follow a consistent structure pattern:

```bash
features/[feature-name]/
├── api/              # React Query hooks (e.g., use-otp-login.js)
├── components/       # Feature-specific components
├── pages/            # Feature page components
├── providers/        # Context providers (e.g., AuthProvider)
├── utils/            # Feature utilities
├── constants.js      # Feature constants
└── index.js          # Public API exports
```

**Important**: Do NOT import from inside feature subdirectories. Always import from the feature's root `index.js`. The ESLint configuration enforces this rule:

```javascript
// ❌ Bad
import { LoginForm } from '@/features/auth/components/LoginForm'

// ✅ Good
import { LoginForm } from '@/features/auth'
```

### Data Fetching Layer

- **React Query** (TanStack Query) is used for all server state management
- Query client is configured in `src/data/with-query-client.js` with:
  - No retry on failed requests
  - No refetch on mount or window focus
  - 5-minute cache time on client, 1-second on server
- API functions are defined in `src/data/api/` and organized by domain (auth, contract, user, etc.)
- HTTP client is configured in `src/data/services/`
- Use `withQueryClient` HOF for SSR data prefetching in `getInitialProps`

### Authentication Flow

- Token-based authentication using access and refresh tokens
- `AuthProvider` in `src/features/auth/providers/AuthProvider.jsx` manages auth state
- Tokens are stored in cookies (keys defined in env vars)
- Use `useAuthContext()` hook to access auth state and current user
- Pages requiring auth should use `requireAuth` prop in the Layout
- OTP-based login flow: send OTP → verify code → receive tokens

### Styling

- **Tailwind CSS** for utility-first styling
- Custom design system with branded colors (teal, rust, gray palettes)
- Custom font: IRANSansX (Persian/Farsi support)
- Global styles in `src/assets/styles/global.scss`
- SCSS modules with function utilities available via Sass prependData
- Radix UI primitives for accessible components (Dialog, Popover, Tooltip)
- Class variance authority (CVA) for component variants

### Forms

- React Hook Form for form state management
- Zod for schema validation with `@hookform/resolvers`
- Form components in `src/components/ui/Form/`

### Routing & Layouts

- Next.js Pages Router (not App Router)
- Custom layout system: components can define `Component.layout` and `Component.layoutOptions`
- Default layout is `NoneLayout` from `@/features/app`
- Layout options support `bottomNavigation` and `bottomCTA` for mobile UI

## Code Conventions

### Import Aliases

- `@/*` maps to `src/*` (configured in jsconfig.json)

### ESLint Configuration

- Based on Airbnb style guide + Next.js + Prettier
- Custom rules:
  - No React import required (Next.js 13+)
  - JSX prop spreading allowed
  - No prop-types enforcement
  - Unused vars prefixed with `_` are allowed
  - Console.log warns (console.warn/error allowed)
  - Restricted imports: cannot import from inside feature subdirectories

### Prettier Settings

- 100 character line width
- Single quotes
- No semicolons
- 2-space indentation
- LF line endings

### Naming Conventions

- Component files: PascalCase (e.g., `Button.jsx`)
- Utility/hook files: kebab-case (e.g., `use-auth.js`)
- Feature API hooks: `use-[action].js` pattern (e.g., `use-otp-login.js`)
- API functions: `api[Action]` pattern (e.g., `apiOTPLogin`)

## Environment Variables

Key environment variables (define in `.env.local`):

- `NEXT_PUBLIC_BASE_URL` - Public base URL
- `NEXT_PUBLIC_API_URL` - Public API URL  
- `NEXT_PUBLIC_BLOG_URL` - Blog URL
- `API_URL` - Server-side API URL (proxied via Next.js rewrites)
- `APP_ENV` - Environment (production, staging, etc.)
- `NEXT_PUBLIC_ACCESS_TOKEN_KEY` - Cookie key for access token
- `NEXT_PUBLIC_REFRESH_TOKEN_KEY` - Cookie key for refresh token
- `NEXT_PUBLIC_LOGIN_AS_USER_KEY` - LocalStorage key for admin login state
- `NEXT_PUBLIC_SUPABASE_*` - Supabase configuration

## Deployment

### Docker

- Multi-stage Dockerfile for optimized production builds
- Standalone output mode for minimal image size
- Runs on Node 18 Alpine
- Exposed on port 3000

### Liara Platform

- Configured in `liara.json`
- Platform: next
- Port: 3000

### API Proxy

Next.js rewrites `/api/*` requests to the backend API URL defined in `API_URL` environment variable.

## Testing

This project uses **Storybook** for component development and visual testing. There is no dedicated test framework configured (no Jest/Vitest setup detected). When implementing tests:

- Check if the team has established a testing approach
- Look for test files or configuration before assuming a testing strategy

## Third-Party Integrations

- **Supabase** - Backend/database
- **Leaflet** - Map functionality (`react-leaflet`)
- **Microsoft Clarity** - Analytics
- **Goftino** - Customer chat widget
- **Google Tag Manager** - Marketing/analytics
- **Eitaa** - Social authentication (Iranian messaging platform)
- **QR Scanner** - `@yudiel/react-qr-scanner`

## Special Considerations

- **RTL Support**: This is a Persian/Farsi application with right-to-left text direction
- **Date Handling**: Uses both standard `date-fns` and `date-fns-jalali` for Persian calendar support
- **Mobile-First**: Layout system includes mobile-specific UI elements (bottom navigation, CTAs)
- **Error Boundaries**: React Error Boundary wraps all pages for graceful error handling
- **Broadcast Channel**: Uses broadcast channel for cross-tab communication (e.g., logout sync)
- **SEO**: Custom SEO component with OpenGraph support
- **Standalone Output**: Next.js configured for standalone deployment (optimal for Docker)
