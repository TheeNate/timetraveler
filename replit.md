# Timesheet Application

## Overview

This is a full-stack timesheet application built for "Corda Vertical Traveler" company. The application allows users to create, manage, and track timesheets with technician hours, job details, and travel information. It's designed as a Progressive Web App (PWA) with mobile-first capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: React Query (TanStack Query) for server state
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Mobile Support**: Responsive design with PWA capabilities

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **API Style**: RESTful API with `/api` prefix
- **Development**: Hot reload with Vite dev server integration

### Key Design Decisions
1. **Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories for code organization
2. **TypeScript First**: Full TypeScript support across frontend, backend, and shared code
3. **Component-Based UI**: Modular design using shadcn/ui components for consistency
4. **Mobile-First**: PWA implementation with offline capabilities and app-like experience

## Key Components

### Frontend Structure
- `client/src/App.tsx` - Main application component with routing
- `client/src/components/Timesheet.tsx` - Core timesheet interface (incomplete)
- `client/src/components/ui/` - Reusable UI components from shadcn/ui
- `client/src/pages/` - Page components (Home, NotFound)
- `client/src/hooks/` - Custom React hooks
- `client/src/lib/` - Utility functions and query client setup

### Backend Structure
- `server/index.ts` - Express server setup with middleware
- `server/routes.ts` - API route definitions (currently empty)
- `server/storage.ts` - Data access layer with memory storage implementation
- `server/vite.ts` - Vite integration for development

### Shared Code
- `shared/schema.ts` - Database schema definitions with Drizzle ORM
- Type definitions shared between frontend and backend

## Data Flow

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Extensible Design**: Schema can be extended for timesheet-specific tables

### API Integration
- React Query handles all server communication
- Centralized API request handling in `lib/queryClient.ts`
- Error handling with toast notifications
- Automatic retries and caching

### State Management
- Server state managed by React Query
- Local component state with React hooks
- Form state management ready for integration

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS with PostCSS
- **Forms**: React Hook Form with Zod validation (imported but not implemented)
- **Date Handling**: date-fns library

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type checking
- **Database Migrations**: Drizzle Kit for schema management
- **Session Storage**: connect-pg-simple for PostgreSQL sessions

## Deployment Strategy

### Build Process
1. Frontend builds to `dist/public/` using Vite
2. Backend builds to `dist/` using esbuild
3. Single deployment artifact with static files served by Express

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development environment detection
- Replit-specific plugins for development experience

### Key Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Database schema deployment

### Current Status
The application is fully functional with:
- Complete timesheet functionality with technician time tracking
- Travel time tracking section
- Client and location information forms
- Job details and equipment tracking
- Auto-save functionality (saves every 30 seconds to localStorage)
- HTML export for professional document sharing
- Print capabilities
- Mobile-responsive design optimized for iPad usage
- All original HTML styling and branding preserved

**Recent Updates (Jan 17, 2025)**:
- Converted original HTML timesheet to React-based web application
- Fixed header input text visibility (made text black on white background)
- Implemented HTML export functionality for iPad-friendly document saving
- Removed unnecessary JSON export option per user preference
- Maintained all original styling and functionality from attached HTML file