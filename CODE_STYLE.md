# Code Style

## TypeScript

- **Always use explicit types** for function parameters and return types
- **Use `interface`** for object shapes, `type` for unions/intersections
- **Avoid `any`** - use `unknown` when type is truly unknown
- **Enable strict mode** in tsconfig.json - do not disable strict checks

## Naming Conventions

- **Files**: kebab-case (e.g., `scrape-utils.ts`, `html-parser.ts`)
- **Classes**: PascalCase (e.g., `ScraperService`, `PageAnalyzer`)
- **Functions/variables**: camelCase (e.g., `fetchPage`, `parsedLinks`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`, `MAX_RETRIES`)
- **Interfaces**: PascalCase with optional `I` prefix discouraged (use `ScrapedData` not `IScrapedData`)
- **Booleans**: prefix with `is`, `has`, `should`, `can` (e.g., `isValid`, `hasLinks`)

## Imports

- Use ES modules with `.js` extension for local imports
- Group imports in order: external libs → internal modules → relative imports
- Use path aliases if configured (`@/` for src/)
- **Avoid barrel files (index.ts)** for exports - import directly from the file

```typescript
// Example import order
import * as cheerio from 'cheerio';
import { chromium } from 'playwright';

import { Vehicle } from './types.js';
import { parseHtmlTable } from './parser.js';
import { logInfo } from '../utils/logger.js';
```

## Formatting (Prettier)

- Single quotes for strings
- Semicolons at end of statements
- 2 space indentation
- 100 character line width
- Trailing commas in ES5 contexts (objects, arrays)

## Whitespace & Code Style

- **Blank line before return statements** - keep return statements separated from preceding code
- **Blank line before early returns** in conditionals
- **Space inside self-closing JSX tags** - use `<Component />` not `<Component/>`
- **One blank line between logical sections** - imports → constants → sub-components → main function
- **Always use curly braces** around blocks even when not required (e.g., `if (condition) { return value }`)
- **Comments** should use sentence case

```typescript
// This is a good comment that uses sentence case
// this is a bad comment that does not use sentence case
```

## Error Handling

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

## Frontend

- **UI Library**: Use React Aria for accessible UI components
- **Styling**: Use Tailwind CSS for all styling
- **Routing**: Use react-router-dom for client-side routing

### Page Components

- For page files (e.g., `Vehicles.tsx`), create semantically named sub-components for readability
- Place sub-components at the top of the file, main export function at the bottom
- Example: `Loading`, `ErrorOnLoad`, `PageHeader` as separate const arrow functions

### Matching Existing Component Styles

When adding new UI components to pages with existing components, always match the styling of those components:

- **Labels**: Always use `text-sm font-medium text-gray-700`
- **Option text**: Use `text-sm font-medium text-gray-800`
- **Button/card padding**: Use `px-4 py-3` or similar
- **Border radius**: Use `rounded-lg` (not `rounded-full` for buttons)
- **Horizontal layouts**: Use `flex flex-row flex-wrap gap-2`

Check existing components like `FilterCardGroup` and `BrRangeSlider` for reference before adding new UI elements.

## General Patterns

- Use `async/await` over raw promises
- Use `null` over `undefined` for optional values (except in unions)
- Prefer immutable patterns - use `const`, avoid mutating objects
- Use early returns to reduce nesting
- Keep functions small and focused (single responsibility)
- Export helper functions from parser.ts for reuse in tests to avoid code duplication
- Consider any documentation and/or diagrams that may need updating when planning your changes

## Documentation Updates

- Update README files when changing folder structure, adding new dependencies, or modifying tech stack
- Update AGENTS.md when introducing new patterns, conventions, or project-specific rules
- Treat documentation as part of the code change - do not defer
