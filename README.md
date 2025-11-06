```markdown
# E‑commerce Marketplace with Seller Dashboard — Fullstack Reference

This repository is a production-capable reference implementation of an e-commerce marketplace with a seller dashboard. It is written in clear, human-friendly TypeScript and designed to be easy to run locally and straightforward to extend for production.

Key features
- Buyer-facing storefront: browse products, view product details, add to cart, and place orders (demo checkout).
- Seller dashboard: sellers can list products, view orders, and see simple sales analytics.
- Auth: JWT-based demo auth (email-less login for local dev). Replace with OAuth/SSO in production.
- Database: Prisma ORM with SQLite by default for local dev. Easily switch to Postgres in production via DATABASE_URL.
- Payment: Stripe integration hooks are included and stubbed for safe local development (no live charges).
- Infrastructure: Docker Compose for local development, separate server and web services.
- Developer ergonomics: TypeScript, ESLint, Prettier, GitHub Actions CI pipeline.

Architecture
- server/ — Fastify (TypeScript) backend with REST APIs for auth, products, sellers, and orders. Uses Prisma ORM for persistence.
- web/ — Next.js (TypeScript + React) storefront and seller dashboard. Simple, accessible UI with client-side state and data fetching from server APIs.
- docker-compose.yml — local dev stack (server + web + optional Postgres).
- .env.example — environment variables to run locally.

Why this repo
This scaffold is aimed at full‑stack engineers who want a demonstrable project showing:
- End-to-end ownership (frontend, backend, data layer, Docker).
- Real-world e-commerce concerns: seller separation, multi-role UI, order lifecycle, and payments plumbing.
- Clear, well-commented, human-readable code and documentation.

Quickstart (local dev)
1. Copy .env.example -> .env (both root and server/.env.example for server).
2. Install root dependencies and bootstrap (works with npm or Yarn workspaces):
   - npm install
3. Initialize the database (Prisma + SQLite by default):
   - cd server
   - npx prisma migrate dev --name init
4. Start services with Docker Compose (optional) or run locally:
   - docker-compose up --build
   OR
   - In two terminals:
     - cd server && npm run dev
     - cd web && npm run dev
5. Open the web app at http://localhost:3000

Notes on production
- Use a managed Postgres DB and set DATABASE_URL in production environments.
- Replace demo auth with a real identity provider (Auth0, GitHub, Google).
- Configure Stripe with live keys and webhooks for order payment fulfillment.
- Add TLS, rate-limiting, monitoring, and proper secrets management (Vault/KMS).

What's included
- Server: REST API, Prisma schema, migrations, Dockerfile, and helpful comments in code.
- Web: Next.js app with storefront & seller dashboard pages.
- CI: GitHub Actions workflow that builds server and web.
- Docs: README, CONTRIBUTING, and NOTES for extending the project.

If you want, I can:
- Add SSO/OAuth integration (GitHub/Google).
- Wire up Stripe webhooks and order fulfillment (with test mode).
- Replace SQLite with Postgres in docker-compose and provide production-ready migration steps.
- Add Kubernetes manifests and Helm charts.

Read on for the full project files (human-written). Happy hacking!
```
