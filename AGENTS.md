# AGENTS.md - Project Guidelines

## Project Overview

React + TypeScript + Vite full-stack application with Express backend and MongoDB (Prisma ORM).

## Build/Lint/Test Commands

```bash
# Development (runs both client and server)
npm run dev

# Client only
npm run client:dev

# Server only (with hot reload)
npm run server:dev

# Production build
npm run build

# Type checking
npm run check

# Linting
npm run lint

# Preview production build
npm run preview
```

**Note:** This project does not have a test framework configured yet. Consider adding Vitest or Jest if tests are needed.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router, Zustand
- **Styling:** Tailwind CSS, clsx, tailwind-merge
- **Backend:** Express.js, Node.js
- **Database:** MongoDB with Prisma ORM
- **Build:** Vite with path aliases (@/*)

## Code Style Guidelines

### TypeScript

- Target ES2020, module ESNext
- Path alias `@/*` maps to `./src/*`
- Strict mode is **disabled** in tsconfig (be extra careful with types)
- Include types for node and express

### Imports

- Use `@/` alias for src imports: `import Component from '@/components/Component'`
- Group imports: React → Libraries → Local (@/) → Relative
- Use type imports when needed: `import type { Thing } from './types'`

### React Components

- Use functional components with arrow functions
- PascalCase for component names: `Navbar`, `ProjectForm`
- Use `cn()` utility for Tailwind class merging:
  ```tsx
  import { cn } from '@/lib/utils';
  className={cn('base-classes', condition && 'conditional-class')}
  ```
- Use clsx directly for simple conditional classes

### Naming Conventions

- Components: PascalCase (`BlogDetail.tsx`)
- Hooks: camelCase with `use` prefix (`useTheme.ts`)
- Utilities: camelCase (`utils.ts`)
- API routes: camelCase (`auth.ts`, `projects.ts`)
- Pages: PascalCase in `src/pages/`

### File Organization

```
src/
  components/     # Reusable UI components
  pages/          # Route-level components
  hooks/          # Custom React hooks
  lib/            # Utility functions
  main.tsx        # Entry point
  App.tsx         # Root component
  index.css       # Global styles + Tailwind

api/
  routes/         # Express route handlers
  middleware/     # Express middleware
  lib/            # Server utilities (prisma client)
  app.ts          # Express app setup
  server.ts       # Server entry (development)
  index.ts        # Serverless entry (Vercel)
```

### Styling (Tailwind)

- Use custom color palette from tailwind.config.js:
  - `bg-background` (#0A0A0A), `text-primary` (#EDEDED)
  - `text-secondary` (#A0A0A0), `text-tertiary` (#6B6B6B)
  - `accent-crimson`, `accent-glow`, `accent-forge`
  - `border` (#2A2A0A)
- Custom fonts: `font-sans` (Inter), `font-serif` (Playfair), `font-mono` (JetBrains Mono)
- Dark mode by default (darkMode: "class" in config)

### Backend (Express)

- Use async/await for database operations
- Return JSON responses: `res.json({ data })` or `res.status(500).json({ error: 'msg' })`
- Use Prisma client from `api/lib/prisma.ts`
- JWT auth pattern already established in `api/routes/auth.ts`

### Error Handling

- Wrap async route handlers in try-catch
- Return appropriate HTTP status codes
- Generic error messages to client; log details server-side
- TypeScript strict mode is OFF - validate inputs explicitly

### Database (Prisma)

- MongoDB with Prisma ORM
- Models: Project, Blog, AdminAuth
- Use `@map("_id")` for MongoDB ObjectId
- Run `npx prisma generate` after schema changes

## Environment Variables

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CLOUDINARY_*` - For image uploads

## Important Notes

- **NO PRETTIER CONFIG** - Follow existing code style manually
- TypeScript strict mode is disabled - be defensive with types
- API proxy configured in Vite (routes `/api` to localhost:3001)
- Server uses nodemon with tsx for TypeScript execution
- Vercel deployment ready (see `api/index.ts`)
