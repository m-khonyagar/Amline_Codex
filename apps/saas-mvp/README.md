# Hamkar Plus MVP

Persian RTL SaaS MVP for project, task, team operations, and light CRM.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- TanStack Query
- Prisma + PostgreSQL
- Session-based auth + RBAC
- Storage abstraction (local + S3-ready)

## Run
1. Copy `.env.example` to `.env`
2. Install: `npm install`
3. Prisma generate: `npm run prisma:generate`
4. Migrate: `npm run prisma:migrate`
5. Seed: `npm run prisma:seed`
6. Start: `npm run dev`

## Demo Account
- `owner@hamkar.app`
- Password: `12345678`
