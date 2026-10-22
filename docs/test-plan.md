# Test Plan

## Objective

Verify core product-discovery and cart behavior with seven independent scenarios against the public Toolshop demo.

| # | Layer | Scenario and expected outcome |
|---|---|---|
| 1 | UI | Search for pliers: Combination Pliers is visible and no displayed product name lacks the search term. |
| 2 | UI | Search for an unknown term: show the no-results message and no product cards. |
| 3 | API | Search for pliers: HTTP 200, a nonempty product array, and matching names. |
| 4 | API | Search for an unknown term: HTTP 200, an empty product array, and total zero. |
| 5 | UI | A fresh cart displays the selected available product, quantity one, and the unit price read from the details page. |
| 6 | UI | Change quantity to two: show update confirmation and recalculate the single-product cart total. |
| 7 | API + UI | Create a cart and add two items through the API; checkout displays the product and quantity; delete the cart afterward. |

## Execution and data

Local execution of `npx playwright test` passed all 21 executions: seven scenarios across Chromium, Firefox, and WebKit projects. UI scenarios exercise the respective browsers; API-only scenarios repeat per project without using a browser. Chromium remains the initial CI target. Local execution permits parallel tests; CI uses one worker to limit load. Tests must pass independently and do not rely on order. No hard waits or full-test retries are used.

Tests use public catalog products rather than changing shared product data. The API-assisted scenario discovers product IDs at runtime and uses a newly generated cart ID. Unknown search input is deliberately unlikely to match catalog content. Never commit tokens, credentials, real customer data, or recorded authenticated state.

Cart scenarios select an in-stock, non-rental product from the first page of API search results for pliers. Setup fails explicitly if no eligible product exists. The UI tests still select and add the product through the browser; the API-assisted test adds it through the API. Stock can change after selection, and `in_stock` does not guarantee two units are available.

## Known limitations and observed failures

- Public backend availability, network latency, stock, catalog changes, and data resets can affect results. Product names are dependencies even though IDs are not hard-coded.
- Search responses are paginated. Search tests verify returned/displayed products, not the entire catalog or every page.
- A trace showed the initial catalog response completing after a search response and overwriting its results. The listing Page Object now waits for initial products before submitting a search. This avoids that observed overlap; it does not repair the application race.
- Recorded cart failures rejected IDs returned by search: UI requests returned 422 with an invalid-product-ID message; an API add request redirected and ultimately returned 404. Later manual and automated runs passed. The root cause remains unconfirmed.
- The API-assisted cart is deleted in `finally`. UI-created carts currently remain on the demo backend after browser teardown; adding API cleanup for those is follow-up work. Closing a browser context does not delete server data.
- Session-storage setup depends on Toolshop's observed `cart_id` implementation. That integration test intentionally skips the UI add-to-cart flow, which separate UI scenarios cover.
- Price checks verify page-to-cart consistency and arithmetic, not an independently approved business price. Quantity coverage is for a single product and quantity two.
- Authentication, checkout completion, payment, sorting, filters, accessibility audits, performance, security, and full API schema validation are outside the validated scope. Browser coverage is limited to these seven scenarios and the configured desktop profiles.
- Playwright executes TypeScript without performing a full type check. A dedicated compiler check is not yet configured.

## Failure investigation

Read the first failure, identify whether it occurred in setup or the scenario, and inspect its trace and network responses. Compare sent IDs, response status/body, and visible state. Preserve evidence before a targeted rerun. A later pass establishes intermittence, not its cause. Distinguish assertion/locator problems, application defects, and environment failures using evidence; leave the cause unconfirmed when necessary.

An isolated local deployment could provide controlled data later. Docker is not required for the current project.
