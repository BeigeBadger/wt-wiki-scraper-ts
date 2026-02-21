# Testing

**Tests are first-class citizens** - always write/update tests when adding or changing code. Treat test files with the same care as production code.

## Vitest (Backend)

- Test files: `*.test.ts` in `test/` directory
- Use `describe` blocks for grouping related tests
- Name tests descriptively: "should extract vehicle name from table row"
- Use AAA pattern: use `// Arrange/Act` when there is no setup, otherwise use `// Arrange` and `// Act` as separate comments
- Place AAA comments on their own line to help them stand out
- Additional explanatory comments should be on a new line underneath the AAA comment
- Place // Act comment immediately before the action being tested

```typescript
import { describe, it, expect } from 'vitest';

describe('parser', () => {
  it('should extract vehicle name from table row', async () => {
    // Arrange
    const fixturePath = path.join(FIXTURES_DIR, 'aviation-ab.html');
    const html = await fs.readFile(fixturePath, 'utf-8');

    // Act
    const $ = cheerio.load(html);
    const rows = getVehicleRows($);

    // Assert
    expect(rows.length).toBeGreaterThan(0);
  });
});
```

**Good example (do this):**
```typescript
// Assert
// Role tags should be disabled (game mode not selected yet)
const fighterTag = screen.getByText('Fighter').closest('div[class*="cursor-"]');
expect(fighterTag).toHaveAttribute('data-disabled', 'true');
```

**Bad example (don't do this):**
```typescript
// Assert - Role tags should be disabled (game mode not selected yet)
const fighterTag = screen.getByText('Fighter').closest('div[class*="cursor-"]');
expect(fighterTag).toHaveAttribute('data-disabled', 'true');
```

### Running Tests

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

## React Testing Library (Frontend)

- Test files: place `*.test.tsx` files next to the components they test (e.g., `VehicleList.tsx` and `VehicleList.test.tsx` in the same directory)
- Use React Testing Library for all component tests
- Prefer `findBy*` queries over `getBy*` and `queryBy*` for async element finding
- Use AAA pattern: use `// Arrange/Act` when there is no setup, otherwise use `// Arrange` and `// Act` as separate comments
- Place AAA comments on their own line to help them stand out
- Additional explanatory comments should be on a new line underneath the AAA comment
- Mock Apollo Client with in-memory data for GraphQL queries
- Prefer finding by roles where possible as it's more semantic
- Use `toBeVisible()` for elements that should be visible, rather than `toBeInTheDocument()`
- **Do not use snapshot testing** for frontend components
- **Minimize mocks** - only mock the bare essentials (e.g., Apollo Client for GraphQL queries)
- **Test behavior, not implementation** - prefer testing user interactions and accessibility
- When adding new components, add basic test coverage for rendering and basic behavior

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { VehicleList } from './VehicleList';

describe('VehicleName', () => {
  const mockVehicles = [
    { id: '1', name: '[Sweden]Bf 109 G-2', country: 'sweden', rank: 3, role: 'Fighter', battleRating: { arcade: 3.0, realistic: 3.7, simulator: 4.0 } },
  ];

  it('should render vehicle name with country tag', async () => {
    // Arrange
    render(
      <MockedProvider>
        <VehicleList vehicles={mockVehicles} />
      </MockedProvider>
    );

    // Act
    const vehicleName = await screen.findByText('[Sweden]Bf 109 G-2');

    // Assert
    expect(vehicleName).toBeInTheDocument();
  });
});
```

**Good example (do this):**
```typescript
// Assert
// Role tags should be disabled (game mode not selected yet)
const fighterTag = screen.getByText('Fighter').closest('div[class*="cursor-"]');
expect(fighterTag).toHaveAttribute('data-disabled', 'true');
```

**Bad example (don't do this):**
```typescript
// Assert - Role tags should be disabled (game mode not selected yet)
const fighterTag = screen.getByText('Fighter').closest('div[class*="cursor-"]');
expect(fighterTag).toHaveAttribute('data-disabled', 'true');
```
