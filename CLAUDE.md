# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Leno Admin is a full-stack admin management system with separate frontend and backend components:
- **Backend**: Node.js/Koa2 + TypeScript + MySQL(Sequelize) + Redis + JWT authentication
- **Frontend**: React 18 + TypeScript + Webpack 5 + Ant Design + MobX state management
- **Architecture**: Monorepo with separate backend and frontend directories

## Development Commands

### Root Level Commands
```bash
# Install dependencies for both frontend and backend
npm run install

# Start both frontend and backend in development mode
npm run dev

# Build both frontend and backend for production
npm run build
```

### Backend Commands (run from /backend directory)
```bash
# Development server with hot reload
yarn dev

# Development server for Docker environment
yarn docker:dev

# Production build
yarn build

# Start production server
yarn prod:start

# Lint and fix TypeScript code
yarn lint
```

### Frontend Commands (run from /frontend directory)
```bash
# Development server
yarn dev

# Test environment server
yarn test

# Production build
yarn build

# Run both ESLint and Stylelint
yarn lint

# ESLint only
yarn lint-eslint

# Stylelint for SCSS files only
yarn lint-stylelint
```

## Architecture

### Backend Structure
- **MVC Pattern**: Controllers, Middleware, Services, Models
- **Database**: Sequelize ORM with MySQL, models in `/mysql/model/`
- **Authentication**: JWT-based with Redis session storage
- **API Routes**: Organized by feature modules (system, monitor, tool)
- **Business Logic**: Located in `/business/` with separate layers:
  - Controllers: Request handling
  - Middleware: Request processing and validation
  - Services: Business logic
  - Utils: Helper functions and utilities

### Frontend Structure
- **Component Architecture**: Functional components with React Hooks
- **State Management**: MobX with separate stores for global, user, layout, permission
- **Routing**: React Router v6 with lazy loading
- **UI Framework**: Ant Design v4 with custom SCSS styling
- **API Layer**: Axios-based API client with module organization

### Key Features
- Role-based permission system with dynamic menu generation
- Code generator for CRUD operations
- System monitoring (Redis, server stats, online users)
- File upload with image cropping
- Real-time notifications via Socket.IO
- Audit logging for operations and login attempts

## Database Setup

The project includes a complete MySQL schema in `/backend/src/mysql/leno_admin.sql`. The system uses:
- User management with department/role hierarchy
- Menu-based permission system
- Dictionary data management
- System configuration
- Audit logging tables

## Docker Support

Production deployment via Docker Compose with services for MySQL, Redis, backend (Node.js), and frontend (Nginx). Configuration in `docker-compose.yml`.

## Development Notes

- Backend uses `ts-node-dev` for development with path mapping
- Frontend uses Webpack 5 with React Hot Reload
- Both projects have ESLint configuration with TypeScript support
- Pre-commit hooks configured for code formatting and linting
- API endpoints follow RESTful conventions with `/api/` prefix