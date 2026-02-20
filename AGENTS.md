# AGENTS.md

Table of contents for agent context. See linked documents for details.

## Project Overview

TypeScript web scraper using Playwright for browser automation and Cheerio for HTML parsing. Data stored in JSON files with optional MongoDB population. Frontend is React + Tailwind + Apollo GraphQL.

## Quick Commands

```bash
npm run build          # Build TypeScript
npm run lint           # Run linter
npm test               # Run tests
npm run scrape         # Run scraper (includes DB population)
```

Full command reference: [docs/COMMANDS.md](docs/COMMANDS.md)

## Documentation Map

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Project structure, tech stack, requirements |
| [CODE_STYLE.md](CODE_STYLE.md) | TypeScript conventions, formatting, naming |
| [TESTING.md](TESTING.md) | Vitest + React Testing Library patterns |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Full command reference |

## Key Patterns

- **Frontend**: React Aria for UI, Tailwind for styling, react-router-dom for routing
- **Testing**: Vitest for backend, React Testing Library for frontend
- **Scraping**: Playwright (browser) + Cheerio (parsing)
- **Database**: MongoDB (optional)

## Project Structure

```
src/
├── app/       # React frontend (components, pages, lib)
├── scraper/   # Playwright scraper + Cheerio parser
└── server/    # GraphQL server
data/          # JSON output + raw HTML
test/          # Test fixtures
```

Full structure: [ARCHITECTURE.md](ARCHITECTURE.md)

## When Making Changes

1. Check relevant documentation in the map above
2. Follow patterns in [CODE_STYLE.md](CODE_STYLE.md)
3. Add/update tests per [TESTING.md](TESTING.md)
4. Update docs if adding patterns or changing structure
