# Architecture

## Requirements

- **Node.js** - v18 or higher
- **MongoDB** - v6 or higher (auto-starts if installed but not running)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Scraping | Playwright (browser automation), Cheerio (HTML parsing) |
| Backend | Node.js, TypeScript, MongoDB |
| Frontend | React, Tailwind CSS, React Aria, Apollo Client |
| Server | GraphQL (Apollo Server) |
| Testing | Vitest, React Testing Library |

## Project Structure

```
.
├── data/                    # JSON data files (root/data)
│   ├── aviation/           # Aviation vehicle data
│   └── raw/                # Raw HTML downloads
├── src/
│   ├── app/                 # React frontend
│   │   └── src/
│   │       ├── components/ # React components
│   │       ├── pages/      # Page components (Home, Vehicles, LineUpBuilder)
│   │       ├── lib/        # Apollo client
│   │       └── App.tsx     # Main app component
│   ├── scraper/            # TypeScript scraper
│   │   ├── index.ts        # CLI entry point
│   │   ├── browser.ts      # Playwright browser setup
│   │   ├── scraper.ts      # Main scraping orchestration
│   │   ├── parser.ts       # HTML parsing with Cheerio
│   │   ├── output.ts       # JSON file output
│   │   ├── database.ts     # MongoDB population logic
│   │   ├── utils/          # Utilities
│   │   │   ├── logger.ts   # Logging
│   │   │   └── fixtures.ts # Download fixtures
│   │   └── test/          # Test files
│   │       └── fixtures/  # HTML fixtures
│   └── server/             # GraphQL server
├── test/
│   └── fixtures/          # HTML test fixtures
├── package.json
└── README.md
```

## Domains

### Scraper (`src/scraper/`)

- **browser.ts**: Playwright browser lifecycle management
- **scraper.ts**: Main orchestration, coordinates fetching and parsing
- **parser.ts**: HTML parsing with Cheerio, extracts vehicle data
- **output.ts**: Writes JSON files to `data/`
- **database.ts**: Populates MongoDB from JSON files

### Server (`src/server/`)

GraphQL API serving vehicle data to the frontend.

### App (`src/app/`)

React frontend with Tailwind styling and Apollo Client for GraphQL queries.

## Data Flow

```
Wiki HTML → Playwright (fetch) → Cheerio (parse) → JSON files → MongoDB (optional)
                                                          ↓
                                              GraphQL Server → React Frontend
```
