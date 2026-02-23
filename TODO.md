# TODO

## Features

- Generate line up feature
- Add loading state (https://react-aria.adobe.com/ProgressBar), ProgressCircle, on initial load, it should take into account the state of the nations, categories, and roles queries. Ensure the element the ensure it has an aria-label (Loading initial data). Update guidance in relevant MD file around a11y. For the vehicles query, replace the inline loading component with a ProgressCircle with the same config as the initial load except a different aria-label (Loading vehicle data)
- Snackbar for error messages, especially from GQL things
- Getting started from scratch/up and running documentation (for first time set up)

## Fixes

- Better disabled styling for the battle rating range
- More era appropriate flags, especially for Soviet Union
- Better icons for the vehicle types
- Split out filters into their own files
- Instead of duplicating the queries in the component and tests, add a hook the exports the query, so that it can be used in tests. Tests can always use a cut-down version of the query if they want

### Tests

- Make selector functions to reduce duplicated logic in tests (update MD file once done)
  - Helper functions too
- Another pass on FE tests:
  - Add vars
  - Helper methods
- Fix errors in FE test logs
