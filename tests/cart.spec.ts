import { test, expect } from '../fixtures/test';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

let expectedPrice: string;
let expectedName: string;

test.beforeEach(async ({ page, productListingPage, availableProduct, cartPage }) => {
  expectedName = availableProduct.name;
  await productListingPage.goto();
  await productListingPage.search(expectedName);
  await page.getByRole('heading', { name: expectedName, exact: true }).click();

  const productDetailsPage = new ProductDetailsPage(page);
  await expect(productDetailsPage.addToCartButton, 'Selected product must remain available').toBeEnabled();
  await expect(productDetailsPage.unitPrice).toHaveText(/^\d+\.\d{2}$/);
  expectedPrice = (await productDetailsPage.unitPrice.innerText()).trim();

  await productDetailsPage.addToCart();
  await expect(productDetailsPage.addedToCartAlert).toBeVisible();

  await cartPage.open();
});

test('cart displays the added product and its unit price', async ({ page, cartPage }) => {
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/checkout');
  await expect(cartPage.productTitle).toHaveText(expectedName);
  await expect(cartPage.quantity).toHaveValue('1');
  await expect(cartPage.productPrice).toHaveText(`$${expectedPrice}`);
});

test('updating cart quantity recalculates the total', async ({ cartPage }) => {
  const priceInCents = Math.round(Number(expectedPrice) * 100);
  const expectedTotal = ((priceInCents * 2) / 100).toFixed(2);

  await expect(cartPage.quantity).toHaveValue('1');
  await cartPage.updateQuantity(2);

  await expect(cartPage.quantityUpdatedAlert).toBeVisible();
  await expect(cartPage.quantity).toHaveValue('2');
  await expect(cartPage.total).toHaveText(`$${expectedTotal}`);
});
