# AGENTS.md

## Project Overview

TypeScript web scraper project using Playwright for browser automation and Cheerio for HTML parsing. Uses Vitest for testing. Data is stored in JSON files and optionally populated to a MongoDB database.

## Requirements

- **Node.js** - v18 or higher
- **MongoDB** - v6 or higher (auto-starts if installed but not running)

## Build, Lint, and Test Commands

```bash
# Build TypeScript to JavaScript
npm run build

# Run linter
npm run lint

# Fix lint errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with UI
npm test:ui

# Download test fixtures
npm run test:fixtures

# Run scraper (includes DB population by default)
npm run scrape

# Run scraper with verbose logging
npm run scrape -- --verbose

# Run scraper but skip database population
npm run scrape -- --skip-db

# Populate database from existing JSON files
npm run db:populate

# Initialize/test database connection
npm run db:init
```

### Running a Single Test

```bash
# Run a specific test file
npx vitest run test/parser.test.ts

# Run tests matching a pattern
npx vitest run -t "should extract name"

# Run a specific test by name
npx vitest run -t "should extract vehicle name from table row"
```

## Code Style Guidelines

### TypeScript

- **Always use explicit types** for function parameters and return types
- **Use `interface`** for object shapes, `type` for unions/intersections
- **Avoid `any`** - use `unknown` when type is truly unknown
- **Enable strict mode** in tsconfig.json - do not disable strict checks

### Naming Conventions

- **Files**: kebab-case (e.g., `scrape-utils.ts`, `html-parser.ts`)
- **Classes**: PascalCase (e.g., `ScraperService`, `PageAnalyzer`)
- **Functions/variables**: camelCase (e.g., `fetchPage`, `parsedLinks`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`, `MAX_RETRIES`)
- **Interfaces**: PascalCase with optional `I` prefix discouraged (use `ScrapedData` not `IScrapedData`)
- **Booleans**: prefix with `is`, `has`, `should`, `can` (e.g., `isValid`, `hasLinks`)

### Imports

- Use ES modules with `.js` extension for local imports
- Group imports in order: external libs → internal modules → relative imports
- Use path aliases if configured (`@/` for src/)

```typescript
// Example import order
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';

import { Vehicle } from './types.js';
import { parseHtmlTable } from './parser.js';
import { logInfo } from '../utils/logger.js';
```

### Formatting (Prettier)

- Single quotes for strings
- Semicolons at end of statements
- 2 space indentation
- 100 character line width
- Trailing commas in ES5 contexts (objects, arrays)

### Error Handling

- Use custom error classes extending `Error` for domain-specific errors
- Always include meaningful error messages with context
- Use try/catch at service boundaries, let errors propagate from utilities
- Log errors with appropriate context before rethrowing
- Use subdirectories in logger: 'scraping' or 'db-population'

```typescript
// Good error handling pattern
export class ScraperError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ScraperError';
  }
}
```

### Testing (Vitest)

- Test files: `*.test.ts` in `test/` directory
- Use `describe` blocks for grouping related tests
- Name tests descriptively: "should extract vehicle name from table row"
- Use AAA pattern: // Arrange, // Act, // Assert
- Wrap all test logic in try-catch blocks

```typescript
import { describe, it, expect } from 'vitest';

describe('parser', () => {
  it('should extract vehicle name from table row', async () => {
    try {
      // Arrange
      const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');
      const html = await fs.readFile(fixturePath, 'utf-8');
      
      // Act
      const $ = cheerio.load(html);
      const rows = getVehicleRows($);
      
      // Assert
      expect(rows.length).toBeGreaterThan(0);
    } catch (error) {
      throw new Error(`Test failed: ${error}`);
    }
  });
});
```

### Project Structure

```
src/
├── index.ts           # Main entry point, CLI handling
├── scraper/          # Core scraping logic
│   ├── browser.ts    # Playwright browser setup
│   ├── scraper.ts   # Main scraping orchestration
│   ├── parser.ts    # HTML parsing with Cheerio, helper functions
│   ├── output.ts    # JSON and HTML file output
│   ├── database.ts  # MongoDB population logic
│   └── types.ts     # TypeScript interfaces
└── utils/           # Utilities
    ├── logger.ts    # Level-based logging with subdirectory support
    └── fixtures.ts  # Download HTML fixtures
test/
├── fixtures/         # HTML fixtures for testing
└── parser.test.ts  # Parser unit tests
```

### General Patterns

- Use `async/await` over raw promises
- Use `null` over `undefined` for optional values (except in unions)
- Prefer immutable patterns - use `const`, avoid mutating objects
- Use early returns to reduce nesting
- Keep functions small and focused (single responsibility)
- Export helper functions from parser.ts for reuse in tests to avoid code duplication
