import { test, expect } from '@playwright/test';

test('API search returns products whose names contain pliers', async ({ request }) => {
  const response = await request.get(
    'https://api.practicesoftwaretesting.com/products/search',
    { params: { q: 'pliers' } },
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);

  for (const product of body.data) {
    expect(product.name).toMatch(/pliers/i);
  }
});

test('API search returns an empty result for an unknown term', async ({ request }) => {
  const response = await request.get(
    'https://api.practicesoftwaretesting.com/products/search',
    { params: { q: 'qa-no-match-7f92c8' } },
  );

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data).toEqual([]);
  expect(body.total).toBe(0);
});
