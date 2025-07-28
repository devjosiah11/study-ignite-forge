# All Nighter - AI Study Companion

## Overview

All Nighter is a full-stack web application designed as an AI-powered study companion. It helps students organize their study materials by creating project-based collections where they can upload documents, images, and PDFs, then interact with an AI to ask questions about their materials. The application features a modern, study-focused design with a clean interface optimized for academic use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens for study-focused theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with `/api` prefix
- **Development**: Hot module replacement with Vite integration in development mode

### Key Design Decisions

**Monorepo Structure**: The application uses a shared folder approach with:
- `client/` - React frontend application
- `server/` - Express.js backend application  
- `shared/` - Common TypeScript types and database schema
- This allows for type safety across the full stack while maintaining separation of concerns

**Database Strategy**: 
- Uses Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database via Neon's serverless platform
- Schema definitions in TypeScript with automatic type inference
- Memory storage fallback for development/testing

**UI Component Strategy**:
- Radix UI primitives for accessible, unstyled components
- shadcn/ui as the component layer with consistent styling
- Custom study-focused design system with academic color palette
- Responsive design with mobile-first approach

## Key Components

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- Located in `shared/schema.ts` with Zod validation schemas
- Uses Drizzle's type inference for compile-time type safety

### Frontend Components
- **Project Dashboard**: Main interface for managing study projects
- **Project Cards**: Display project metadata, file counts, and last access times
- **Create Project Modal**: Template-based project creation with academic categories
- **Study-focused UI**: Custom button variants and color schemes optimized for academic use

### Backend Services
- **Storage Interface**: Abstracted data access layer with memory and database implementations
- **Route Registration**: Modular route setup in `server/routes.ts`
- **Development Tools**: Request logging and error handling middleware

### Authentication & Session Management
- Basic username/password authentication setup
- Session management prepared with connect-pg-simple for PostgreSQL session store
- User management through the storage interface

## Data Flow

1. **Project Creation**: Users create study projects with categories and descriptions
2. **File Upload**: Users upload PDFs, images, and documents to projects (implementation pending)
3. **AI Interaction**: Users query their materials through AI integration (implementation pending)
4. **Progress Tracking**: System tracks usage statistics and last access times

The application follows a standard request-response pattern:
- Frontend makes API calls using TanStack Query
- Express server processes requests and interacts with database via Drizzle
- Shared types ensure consistency between frontend and backend

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management

### AI Integration (Planned)
- Ready for AI model integration for document analysis and Q&A functionality
- Component structure supports future AI features

### UI Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Lucide React**: Icon library optimized for React
- **Date-fns**: Date manipulation and formatting
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **TypeScript**: Full-stack type safety
- **Vite**: Development server and build tool
- **ESBuild**: Production server bundling

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets in `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `drizzle-kit push`

### Production Configuration
- Node.js server serves both API routes and static frontend assets
- Environment-based configuration for development vs production
- Database connection via environment variable `DATABASE_URL`

### Development Workflow
- Concurrent development with Vite HMR for frontend
- Express server with TypeScript compilation via tsx
- Shared type definitions ensure consistency during development

The application is designed to be deployed on platforms like Railway, Vercel, or similar Node.js hosting services with PostgreSQL database support.