# Toolshop Playwright Portfolio

A small Playwright Test and TypeScript project covering product search and cart behavior on [Toolshop](https://practicesoftwaretesting.com/). Seven scenarios combine UI tests, API tests, and API-assisted UI setup.

## Run locally

Use Node.js 24 and npm. From the project directory:

```bash
npm ci
npx playwright install chromium
npx playwright test --project=chromium
```

`npm ci` installs the versions recorded in `package-lock.json`. Browser installation downloads the browser required by Playwright. On Linux, use `npx playwright install --with-deps chromium` to install browser system dependencies too.

Useful commands:

```bash
# Run cart scenarios with a visible browser.
npx playwright test tests/cart.spec.ts --project=chromium --headed

# Step through a test in Inspector.
npx playwright test tests/cart-api-ui.spec.ts --project=chromium --debug

# Open the most recent HTML report.
npx playwright show-report

# Run locally with CI settings: one worker and no full-test retries.
CI=true npx playwright test --project=chromium
```

The suite contains seven scenarios. A local run across Chromium, Firefox, and WebKit passed all 21 project executions. The UI scenarios exercise each browser; API-only scenarios are repeated per project without launching a browser.

To install all configured browsers and run all projects:

```bash
npx playwright install
npx playwright test
```

## Structure and decisions

| Location | Responsibility |
|---|---|
| `pages/` | Page locators and reusable UI interactions |
| `fixtures/test.ts` | A test-scoped `ProductListingPage` and API-selected available product |
| `tests/search.spec.ts` | Matching and empty UI search results |
| `tests/product-search.api.spec.ts` | Matching and empty API search responses |
| `tests/cart.spec.ts` | Cart contents, price consistency, and quantity recalculation |
| `tests/cart-api-ui.spec.ts` | API-created cart displayed in checkout, followed by API cleanup |
| `.github/workflows/playwright.yml` | Chromium CI execution and artifact upload |

Page Objects centralize selectors and interactions. Scenario expectations and price calculations stay in tests. The cart tests use `beforeEach` to establish a fresh starting state for every scenario. No base-page hierarchy or separate API client is needed for this scope.

Each test receives isolated browser state. Cart scenarios use an `availableProduct` fixture to select an in-stock, non-rental product from the first page of API search results for pliers. If none exists, setup fails with an explicit prerequisite error. The API-assisted test creates its own cart, adds two items, and sets the observed session-storage key `cart_id` before loading checkout. It deletes its cart in `finally`, including after assertion failures. Browser isolation does not isolate the external catalog or backend.

## Reports and debugging

The suite generates an HTML report, retains traces on failure, and captures screenshots for failed UI tests. Full-test retries are disabled; web-first assertions still retry their conditions. Select a failed test in the HTML report and open its trace, or use:

```bash
npx playwright show-trace test-results/<failed-test-folder>/trace.zip
```

Inspect the failing assertion, page snapshot, and network response before changing a timeout or selector. Copy evidence before another run, which can replace it. To retain a trace for a passing investigation run, add `--trace on`.

## CI

GitHub Actions is configured for pushes and pull requests targeting `main` or `master`, and manual runs. The Ubuntu job installs Node 24, locked npm dependencies, and Chromium; then runs with one worker. The `playwright-results` artifact preserves the report and test results for 14 days, including after test failures unless the job is cancelled. No application credentials are required.

Local verification has passed all 21 executions across the three configured projects. CI currently runs the seven Chromium-project executions.

## References

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Toolshop API documentation](https://api.practicesoftwaretesting.com/api/documentation)

