# Testing

**Tests are first-class citizens** - always write/update tests when adding or changing code. Treat test files with the same care as production code.

## Preserving Comments

When refactoring tests (e.g., extracting selectors to constants, creating helper functions), **never remove comments**:

- **Keep AAA comments** (`// Arrange`, `// Act`, `// Assert`) - they help future developers understand test structure
- **Keep explanatory comments** - comments that provide context or insight to future developers are valuable
- **Only remove comments** that are:
  - Plainly wrong or incorrect
  - Addressed (e.g., `// TODO: fix this`, `// BUG: this fails`)
- When extracting code to helpers, keep the AAA comments in the test file to preserve the structure

## Test Fixtures & Patterns

When tests become complex with repeated selectors, mock data, or interaction patterns, extract these into a `__fixtures__` directory colocated with the test file.

### Fixture Directory Structure

```
pages/
├── __fixtures__/
│   └── LineUpBuilder/
│       ├── selectors.ts     # Regex constants for element selection
│       ├── mocks.ts         # GraphQL mocks and test data
│       └── interactions.ts  # Helper functions for user actions
├── LineUpBuilder.tsx
└── LineUpBuilder.test.tsx
```

### When to Extract

- **Selectors**: When the same regex pattern is used 3+ times across tests
- **Mocks**: When GraphQL queries or test data are reused across tests
- **Interactions**: When the same sequence of user actions is repeated

### Example: selectors.ts

```typescript
export const SELECTORS = {
  PAGE_TITLE: /line up builder/i,
  NATION_UNITED_STATES: /united states/i,
  RESET_BUTTON: /reset filters/i,
} as const;
```

### Example: interactions.ts

```typescript
import { SELECTORS } from './selectors';

export async function selectAllFilters(nation, category, gameMode) {
  await waitForNationToBeVisible(nation);
  await selectNation(nation);
  await waitForCategoryToBeEnabled(category);
  await selectCategory(category);
}
```

### Best Practices

- Keep AAA comments in the test file even when using interaction helpers
- Name interaction helpers semantically (e.g., `selectNation` not `clickNationButton`)
- Use TypeScript `as const` for selector patterns
- Export shared mock data objects for reuse

## Vitest (Backend)

- Test files: `*.test.ts` in `test/` directory
- Use `describe` blocks for grouping related tests
- Name tests descriptively: "should extract vehicle name from table row"
- Use AAA pattern: use `// Arrange/Act` when there is no setup, otherwise use `// Arrange` and `// Act` as separate comments
- Place AAA comments on their own line to help them stand out
- Additional explanatory comments should be on a new line underneath the AAA comment and use sentence case
- Place the // Act comment immediately before the action being tested

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
// Reset button should be visible
expect(await screen.findByRole('button', { name: /reset filters/i })).toBeVisible();
```

**Bad example (don't do this):**
```typescript
// Assert - Reset button should be visible
expect(await screen.findByRole('button', { name: /reset filters/i })).toBeVisible();
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
- Use `toBeVisible()` for elements that should be visible, rather than `toBeInTheDocument()`
- **Do not use snapshot testing** for frontend components
- **Minimize mocks** - only mock the bare essentials (e.g., Apollo Client for GraphQL queries)
- **Test behavior, not implementation** - prefer testing user interactions and accessibility
- When adding new components, add basic test coverage for rendering and basic behavior
- Test ProgressCircle components for correct aria-label attributes using `findByRole('progressbar', { name: /loading/i })`

### Selecting Elements

- NEVER select elements using id or CSS classes
- NEVER add `data-test-id` attributes to components - write tests that select elements using WAI-ARIA roles or text content instead
- ALWAYS use at least 2 filters when selecting elements (e.g. role + name)
  - You may add the `aria-label` attribute to elements to help achieve this.
- Use regex with the case-insensitive flag (`/pattern/i`) for name and text queries instead of exact strings
- When encountering multiple matches, first try using start/end anchors (`/^match this$/i`), then ask a human for guidance if needed
- Use `{ hidden: true }` option for elements with `aria-hidden="true"`
- Query priority: `findByRole` → `findByLabelText` → `findByText`

```typescript
// Preferred - role + regex name
await screen.findByRole('button', { name: /hello world/i })

// Okay - role + regex with variable
await screen.findByRole('button', { name: new RegExp(myNameVariable, 'i') })

// Bad - exact string
await screen.findByRole('button', { name: 'Hello World' })

// Bad - single filter only
await screen.findByRole('button')
```

### Interacting with Elements

- ALWAYS use `userEvent` from React Testing Library, NEVER use `fireEvent`

```typescript
it('should enable vehicle type filter after nation is selected', async () => {
  // Arrange
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <LineUpBuilder />
    </MockedProvider>
  );

  await waitFor(async () => {
    expect(await screen.findByRole('button', { name: /united states/i })).toBeVisible();
  });

  // Act
  await userEvent.click(await screen.findByRole('button', { name: /united states/i }));

  // Assert
  await waitFor(async () => {
    expect(await screen.findByRole('button', { name: /aviation/i })).not.toBeDisabled();
  });
});
```
