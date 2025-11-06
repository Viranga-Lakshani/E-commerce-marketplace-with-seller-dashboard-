```markdown
# Contributing

Thanks for checking out this reference project.

Local development
- Copy .env.example to .env in the repo root and server/.env.example to server/.env if you run services directly.
- Install dependencies at the root using a workspace-aware package manager (npm supports workspaces):
  npm install
- Run Prisma migrations in server:
  cd server
  npx prisma generate
  npx prisma migrate dev --name init
- Start dev servers:
  # Option A: run locally
  cd server && npm run dev
  cd web && npm run dev

  # Option B: docker-compose
  docker-compose up --build

Testing & linting
- Server tests: npm run test (server)
- Linting: npm run lint

PRs
- Open a pull request with a clear description and tests where appropriate.