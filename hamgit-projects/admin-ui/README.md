# Project Overview

React-based admin panel for "Amline" built with Vite, using feature-based architecture. The application uses React Router for routing, TanStack Query for data fetching, and Tailwind CSS for styling.

## Development Commands

### Core Commands

- `npm run dev` - Start development server on port 3001 (with --host flag for network access)
- `npm run build` - Build production bundle with Vite
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all .js/.jsx files
- `npm run format` - Format code with Prettier (targets src/ directory)

## Code Architecture

### Feature-Based Structure

The codebase follows a feature-based architecture where each feature is self-contained in `/src/features/[feature-name]/`:

**Available features:**

- `auth` - Authentication (login, OTP, current user)
- `dashboard` - Dashboard and analytics
- `user` - User management
- `contract` - Contract management
- `custom-invoice` - Custom invoice handling
- `settlement` - Settlement management
- `wallet` - Wallet operations
- `ads` - Advertisement management
- `requirement` - Requirements handling
- `clauses` - Contract clauses
- `market` - Market features
- `promo-codes` - Promo code management

**Each feature typically contains:**

- `api/` - React Query hooks and API calls specific to the feature
- `components/` - Feature-specific components
- `pages/` - Page components for routes
- `routes/` - Feature route definitions (exported as `[feature]Routes`)
- `providers/` - Feature-specific context providers
- `index.js` - Public exports (routes, providers, etc.)

### Important Architectural Constraint

**DO NOT import from nested feature directories.** The ESLint rule `no-restricted-imports` enforces that you cannot import from patterns like `@/features/*/*`. Always import through the feature's index.js barrel export.

✅ Correct: `import { AuthProvider } from '@/features/auth'`  
❌ Wrong: `import { AuthProvider } from '@/features/auth/providers/AuthProvider'`

### Core Directories

- **`/src/data/`** - Shared data layer

  - `api/` - Centralized API endpoint definitions (auth.js, user.js, contract.js, etc.)
  - `services/` - Axios instance configuration with auth interceptors
  - `enums/` - Shared enumerations

- **`/src/components/`** - Shared/reusable components

  - `ui/` - UI component library (likely shadcn/ui based)
  - `guards/` - Route guards
  - `icons/` - Icon components

- **`/src/layouts/`** - Layout components (e.g., `AppLayout`)

- **`/src/providers/`** - Global providers

  - `AppProvider.jsx` - Root provider wrapping QueryClient, AuthProvider, Toaster, and device detection

- **`/src/routes/`** - Route configuration

  - `index.jsx` - Root router setup with `AppProvider` wrapper
  - `protected.jsx` - Protected routes requiring authentication
  - `public.jsx` - Public routes (auth pages)

- **`/src/hooks/`** - Custom React hooks (use-debounce, use-mobile, use-permission, etc.)

- **`/src/utils/`** - Utility functions (date, token, number formatting, etc.)

### Data Fetching Pattern

The app uses a two-layer API approach:

1. **Data Layer** (`/src/data/api/[resource].js`): Core API functions and shared hooks

   - Example: `apiAdminLogin(data)` in `/src/data/api/auth.js`

2. **Feature Layer** (`/src/features/[feature]/api/`): Feature-specific API hooks that may wrap data layer functions
   - Example: `useAdminLogin()` in `/src/features/auth/api/login.js` wraps `apiAdminLogin`

Uses TanStack Query with conservative defaults:

- No automatic retries
- No refetch on mount/window focus
- React Query DevTools enabled (top-left position)

### State Management

- **TanStack Query** for server state
- **React Context** for global app state (device detection via `useAppContext`)
- **Feature-specific providers** for feature state (e.g., `AuthProvider` for authentication)

### Routing Structure

All feature routes are nested under protected routes in `/src/routes/protected.jsx`. Routes are authenticated via `useAuthContext().isLoggedIn` check and wrapped in `AppLayout`.

### Styling

- **Tailwind CSS** with custom configuration
- **CSS Variables** for theming (HSL color system)
- **SCSS** with global functions imported via Vite preprocessor options
- Custom color palette: teal, rust, green (plus standard shadcn/ui colors)
- Base font size: 14px with 1.7145 line-height

### Environment Configuration

Environment variables are prefixed with `VITE_`:

- `VITE_APP_TITLE` - Application title
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_USER_CLIENT_APP_URL` - User-facing client URL
- `VITE_ACCESS_TOKEN_KEY` - Access token storage key
- `VITE_REFRESH_TOKEN_KEY` - Refresh token storage key

Stored in `.env.local` (not committed to git).

### Authentication Flow

- Token-based authentication with access/refresh tokens
- Tokens stored in cookies (via `js-cookie`)
- Axios interceptors handle auth headers and token refresh
- Auth state managed by `AuthProvider` from `/src/features/auth`

## Important Notes

- Uses **React Router v6** for routing
- **No prop-types validation** (disabled in ESLint)
- **Prettier** enforces single quotes, no semicolons, 100 char line width
- Uses **Jalali date handling** via `date-fns-jalali`
- Includes **Leaflet** for map functionality
- **React Hook Form** with Zod validation for forms
- Uses **Radix UI** primitives for accessible components
