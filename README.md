# Explorer Sang Petualang

A file system explorer application built with modern web technologies. This proof of concept demonstrates a full-stack implementation with a Bun-based backend API and a Nuxt 3 frontend.

## Demo
Link URL: TBD

## Acknowledgement
Penggunaan tools AI digunakan secara terbatas:
- Brainstorming Acceptance Checklist
- Dokumentasi README.md
- Commit message
- Dockerfile (multi-stage build)

Untuk penulisan kode program, hanya memanfaatkan auto-complete, linting, dan formating pada IDE Jetbrains.

##  Acceptance Checklist: Full-Stack App (Folders Tree)

### A) Product Behavior
- [ ] Two-panel layout (left: folder tree; right: files).
- [ ] Initial load: full folder tree in left panel; right panel empty until click.
- [ ] Supports unlimited nested levels (test ≥ 8 levels).
- [ ] Clicking left tree items updates right panel with *only* direct children (test ≥ 100 children).

### B) Tech Stack
- [ ] TypeScript backend (Bun + Elysia).
- [ ] Vue 3 frontend with Composition API; custom tree component (no tree lib).

### C) Data Model & Queries
- [ ] Learn Adjacency List vs Closure Table vs Nested Set.
- [ ] Learn Indexes

### D) API Design and Documentation
- [ ] Versioning & REST
- [ ] Cache Control
- [ ] A mock server is provided.
- [ ] OpenAPI spec (v3) exists with full endpoint definitions, request/response models, and error schemas.

### E) Frontend Behavior & Accessibility
- [ ] Custom tree component with expand/collapse, using keyboard (arrow keys, Home/End, Enter/Space).
- [ ] Uses proper ARIA (`role="tree"`, `treeitem"`, `group"`, `aria-expanded`, etc.).
- [ ] Performance: remains responsive with ≥ 10k nodes; uses virtualization or progressive render.

### F) Performance Budgets
- [ ] ≤ 300 ms p95 on ~10k-node dataset; paint <1 s.
- [ ] Full tree payload ≤ 1.5 MB (compressed), minimal fields.

### G) Testing Strategy
- [ ] **Server unit tests**
- [ ] **Client unit tests**
- [ ] **Integration tests**
- [ ] **E2E tests**

### H) Security & Robustness
- [ ] Input validation.
- [ ] Protect against DoS.
- [ ] CORS set for SPA origin and validated preflights.

### I) Observability & Operations
- [ ] Request logging.
- [ ] Integrate OpenTelemetry.
---

## Features

- 📁 **Directory Tree Navigation** - Expandable/collapsible folder structure
- 📄 **File Browser** - View files within directories with metadata (size, type, extension)
- 🔄 **Real-time Updates** - Dynamic tree manipulation and file listing
- 🚀 **Modern Stack** - Bun, Elysia, Nuxt 3, Vue 3, TypeScript, Tailwind CSS
- 📊 **API Documentation** - OpenAPI/Swagger documentation

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) (latest version)
- [PostgreSQL](https://postgresql.org/) (version 12 or higher)
- [Node.js](https://nodejs.org/) (version 18 or higher) - for Nuxt compatibility

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd explorer-sang-petualang
```

### 2. Environment Setup

Create environment files for both backend and frontend:

**Backend Environment** (`backend-v1/.env`):
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/explorer_db"
```

**Frontend Environment** (`frontend-v1/.env`):
```bash
API_BASE_URL="http://localhost:8080"
```

### 3. Database Setup

Create a PostgreSQL database:
```bash
createdb explorer_db
```

### 4. Backend Setup

```bash
cd backend-v1

# Install dependencies
bun install

# Generate and run database migrations
bun run db:generate
bun run db:migrate

# Seed the database with sample data
bun run db:seed

# Start development server
bun run dev
```

The backend will be available at `http://localhost:8080`
API documentation: `http://localhost:8080/swagger`

### 5. Frontend Setup

Open a new terminal and run:

```bash
cd frontend-v1

# Install dependencies
bun install

# Start development server
bun run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
explorer-sang-petualang/
├── backend-v1/              # Bun + Elysia API server
│   ├── src/
│   │   ├── database/        # Database schema and migrations
│   │   ├── modules/         # API modules (filesystem)
│   │   └── index.ts         # Application entry point
│   ├── drizzle/             # Database migrations
│   └── docker/              # Docker configuration
├── frontend-v1/             # Nuxt 3 + Vue 3 frontend
│   ├── app/                 # Application code
│   │   ├── pages/           # Route pages
│   │   ├── layouts/         # Layout components
│   │   └── stores/          # State management
│   └── docker/              # Docker configuration
└── CLAUDE.md                # Development guidance
```

## Available Scripts

### Backend (`backend-v1/`)
- `bun run dev` - Start development server with hot reload
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:migrate` - Apply migrations to database
- `bun run db:seed` - Seed database with initial data

### Frontend (`frontend-v1/`)
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run generate` - Generate static site

## API Endpoints

- `GET /api/v1/filesystem/tree` - Get directory tree structure
- `GET /api/v1/filesystem/:id/files` - Get files in a directory
- `GET /swagger` - API documentation

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `brew services start postgresql` (macOS) or `sudo service postgresql start` (Linux)
- Verify database exists: `psql -l | grep explorer_db`
- Check DATABASE_URL format in `.env` file

### Port Conflicts
- Backend runs on port 8080, frontend on port 3000
- Change ports in respective configuration files if needed

### Bun Installation Issues
- Install Bun: `curl -fsSL https://bun.sh/install | bash`
- Restart terminal after installation
- Verify installation: `bun --version`

## Development

This project uses:
- **Backend**: Bun runtime, Elysia framework, Drizzle ORM, PostgreSQL
- **Frontend**: Nuxt 3, Vue 3 Composition API, Tailwind CSS, TypeScript
- **Documentation**: OpenAPI/Swagger for API documentation

