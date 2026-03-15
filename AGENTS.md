# AGENTS.md

## Project

Basic ORM implemented in **TypeScript** for interacting with **PostgreSQL**.

Goal: provide a minimal ORM with decorators, metadata storage, and a repository pattern.

IMPORTANT:
When working on this project prefer **repository-aware reasoning**:

- inspect the codebase
- follow existing patterns
- do not invent new architecture unless explicitly requested.

---

### Project Structure

```bash
src/
├── index.ts                  # Main exports
├── example.ts                # Usage example
├── decorators/               # Decorators for defining entities
│   ├── entity.ts
│   └── index.ts
├── core/                     # Core ORM logic
│   ├── connection/           # Database connection management
│   │   └── connection.ts
│   ├── metadata/             # Entity metadata storage
│   │   └── metadata-storage.ts
│   └── query/                # Query construction
│       └── query-builder.ts
└── repositories/             # Repository pattern implementation
    └── repository.ts
```

---

## Architecture

The ORM follows a layered structure:

Entities (decorators)
↓
Metadata Storage
↓
Query Builder
↓
Connection Layer
↓
Repository API

Guidelines:

- decorators define entity metadata
- metadata storage holds entity schemas
- query builder generates SQL
- repositories expose CRUD operations
- connection layer manages PostgreSQL connections

Never bypass these layers.

---

### Navigation hints

- Entity metadata lives in `core/metadata`
- Query generation logic lives in `core/query`
- Database access should go through repositories

### Before completing any task

1. run tests
2. ensure the project builds
3. verify TypeScript types

---

## Available Commands

- `npm run build` - Compiles the TypeScript project to JavaScript
- `npm run dev` - Runs the project in development mode with ts-node (executes src/index.ts barrel file)
- `npm test` - Executes tests with Jest

---

## Tech Stack

### Languages

- TypeScript v^5.3.0

### Database

- PostgreSQL

### Main Dependencies

- `pg`: PostgreSQL client for Node.js
- `reflect-metadata`: Polyfill for TypeScript decorators

---

## Code Style

General rules:

- Use **TypeScript strict mode**
- Prefer **async/await** over raw promises
- Use **explicit types**
- Avoid `any`
- Use descriptive names
- Keep functions under ~40 lines (if possible)
- Extract helpers for repeated logic

Imports:

- Avoid wildcard imports
- Prefer explicit imports

Comments:

- always in english
- explain **why**, not **what**

---

## Testing Strategy

Testing framework: Jest

Rules:

- every repository method should have unit test
- mock database connections
- avoid real database calls in unit tests
- tests must pass before completing tasks

When modifying logic:

- update tests
- add new tests if behavior changes

---

### Security Guidelines

Always follow these rules:

- never commit secrets
- never commit database credentials
- validate all external input
- always use parameterized queries
- avoid string interpolation in SQL

### Safety Boundaries

Allowed without asking:

- reading files
- running tests
- running build

Ask before:

- installing dependencies
- modifying architecture
- renaming or deleting files
- large refactors

Never:

- commit secrets
- modify database credentials
- remove critical repository abstractions

---

## DO

- use decorators for entity mapping
- use repository pattern for database access
- keep modules small and focused
- write tests for new behavior
- follow existing folder structure
- maintain TypeScript typing

## DON'T

- do not access PostgreSQL directly outside repositories
- do not bypass metada storage
- do not introduce heavy dependencies without approval
- do not modify unrelated files
- do not remove tests unless replacing them

---

## Skills Table

Use this table to determine which skill to load based on the assigned task:

| Task | Skill | Description | Path |
|------|-------|-------------|------|
| Create or update project documentation | `readme` | For creating or updating README.md files with complete documentation | `.agents/skills/readme/SKILL.md` |
| Design system architecture | `architecture-designer` | To create architecture diagrams, evaluate technological trade-offs and design components | `.agents/skills/architecture-designer/SKILL.md` |
| Implement architecture patterns | `architecture-patterns` | To apply Clean Architecture, Hexagonal Architecture or DDD | `.agents/skills/architecture-patterns/SKILL.md` |
| Document technical decisions | `architecture-decision-records` | To create and maintain ADRs following best practices | `.agents/skills/architecture-decision-records/SKILL.md` |
| Write technical documentation | `documentation-writer` | To create documentation following the Diátaxis framework | `.agents/skills/documentation-writer/SKILL.md` |
| Create context files for agents | `agentmd` | To generate minimal CLAUDE.md/AGENTS.md files that are effective | `.agents/skills/agentmd/SKILL.md` |
| Edit documentation files | `docs-writer` | To work with .md files in the repository | `.agents/skills/docs-writer/SKILL.md` |
| Perform security review | `security-best-practices` | To review and improve language-specific security practices | `.agents/skills/security-best-practices/SKILL.md` |
| Generate conventional commit messages | `conventional-commit` | To create commit messages following conventional commits specification | `.agents/skills/conventional-commit/SKILL.md` |
| Explore requirements and design before implementing | `brainstorming` | To explore user intent, requirements and design before any creative work | `.agents/skills/brainstorming/SKILL.md` |

---

### Git Workflow

Commits must follow Conventional Commits

Rules:

- keep commits atomic
- one logical change per commit
- ensure tests pass before commiting

---

### Agent Workflow

1. Always read this AGENTS.md file at the start of a session to understand the project context
2. Consult the skills table above to determine which skill to load for each specific task
3. Explore repository structure
4. Plan minimal changes
5. Implement solution
6. Run tests
7. Verify build
8. Commit using conventional commits
