# Scraper

TypeScript web scraper that collects vehicle data from the War Thunder Wiki.

## Environment Variables

```bash
MONGO_URI=mongodb://localhost:27017
MONGO_DB=warthunder
```

## Getting Started

```bash
cd src/scraper
npm install

# Scrape data (default: aviation) + populate database
npm run scrape

# Scrape with verbose logging
npm run scrape -- --verbose

# Scrape but skip database population
npm run scrape -- --skip-db

# Populate database from existing JSON files
npm run db:populate

# Initialize database connection
npm run db:init
```

## Testing

```bash
# Download test fixtures
npm run test:fixtures

# Run tests
npm run test
```

## Project Structure

```
src/
├── index.ts              # CLI entry point
├── scraper/              # Core scraping logic
│   ├── browser.ts        # Playwright browser setup
│   ├── scraper.ts        # Main scraping orchestration
│   ├── parser.ts         # HTML parsing with Cheerio
│   ├── output.ts         # JSON file output
│   └── database.ts       # MongoDB population logic
├── utils/                # Utilities
│   ├── logger.ts         # Level-based logging
│   └── fixtures.ts       # Download HTML fixtures
└── test/                 # Test files
    └── fixtures/         # HTML fixtures
```
