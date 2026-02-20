# Commands

## Build

```bash
# Build TypeScript to JavaScript
npm run build
```

## Linting & Formatting

```bash
# Run linter
npm run lint

# Fix lint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with UI
npm test:ui

# Download test fixtures
npm run test:fixtures

# Run a specific test file
npx vitest run test/parser.test.ts

# Run tests matching a pattern
npx vitest run -t "should extract name"

# Run a specific test by name
npx vitest run -t "should extract vehicle name from table row"
```

## Scraper

```bash
# Run scraper (includes DB population by default)
npm run scrape

# Run scraper with verbose logging
npm run scrape -- --verbose

# Run scraper but skip database population
npm run scrape -- --skip-db
```

## Database

```bash
# Populate database from existing JSON files
npm run db:populate

# Initialize/test database connection
npm run db:init
```
