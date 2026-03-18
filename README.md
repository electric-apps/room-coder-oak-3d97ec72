# Todo App

A reactive, real-time todo application built with Electric SQL and TanStack DB. Changes sync live across all connected clients via Postgres and Electric.

## Screenshot

_Add a screenshot here_

## Features

- Create todos with a title
- Mark todos as complete/incomplete (with live optimistic updates)
- Delete individual todos
- Clear all completed todos at once
- Real-time sync across browser tabs and devices via Electric SQL
- Persistent storage in Postgres

## Getting Started

```bash
pnpm install
pnpm dev:start
```

The app will be available at `http://localhost:5173`.

## Tech Stack

- **[Electric SQL](https://electric-sql.com)** — Real-time Postgres sync to the client via shapes
- **[TanStack DB](https://tanstack.com/db)** — Reactive client-side collections with live queries and optimistic mutations
- **[Drizzle ORM](https://orm.drizzle.team)** — Schema definitions and migrations
- **[TanStack Start](https://tanstack.com/start)** — Full-stack React meta-framework with SSR
- **[Radix UI Themes](https://www.radix-ui.com/themes)** — Accessible UI components

## Development

```bash
# Start dev server (Vite + Postgres + Electric)
pnpm dev:start

# Stop dev server
pnpm dev:stop

# Run migrations
pnpm drizzle-kit generate && pnpm drizzle-kit migrate

# Run tests
pnpm test

# Build for production
pnpm run build
```

## License

MIT
