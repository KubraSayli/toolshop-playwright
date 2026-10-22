import { test, expect } from '../fixtures/test';

test('searching for pliers shows matching products', async ({ productListingPage }) => {
  await productListingPage.goto();
  await productListingPage.search('pliers');

  const productNames = productListingPage.productNames;
  await expect(productNames.filter({ hasNotText: /pliers/i })).toHaveCount(0);
  await expect(productNames.filter({ hasText: /^\s*Combination Pliers\s*$/ })).toBeVisible();
});

test('searching for an unknown term shows no results', async ({ productListingPage }) => {
  await productListingPage.goto();
  await productListingPage.search('qa-no-match-7f92c8');

  const noResults = productListingPage.noResults;
  await expect(noResults).toBeVisible();
  await expect(noResults).toHaveText('There are no products found.');
  await expect(productListingPage.productNames).toHaveCount(0);
});
