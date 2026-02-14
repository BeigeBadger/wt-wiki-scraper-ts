# WT Wiki Monorepo

A monorepo containing the War Thunder Wiki scraper and web application.

## Project Structure

```
src/
├── app/           # Vite + React 19 frontend
├── scraper/       # TypeScript scraper using Playwright
├── server/        # Express + Apollo GraphQL server
└── shared-types/  # Shared TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB v6+ (via Docker)

### Installation

```bash
# Install root dependencies
npm install

# Install sub-project dependencies
cd src/app && npm install
cd src/server && npm install
cd src/scraper && npm install
```

### Running Locally

Start MongoDB:

```bash
docker compose up -d
```

Run all services (frontend + backend):

```bash
npm run dev
```

Run individually:

```bash
npm run dev:app   # Frontend at http://localhost:5173
npm run dev:server # GraphQL at http://localhost:4000/graphql
```

### Scripts

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `npm run dev`         | Start frontend + backend          |
| `npm run scrape`      | Run the scraper                   |
| `npm run db:populate` | Populate database from JSON files |

## Sub-projects

- [Scraper](./src/scraper/README.md)
- [Server](./src/server/README.md)
- [App](./src/app/README.md)
