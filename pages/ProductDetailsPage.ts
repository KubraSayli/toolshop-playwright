import type { Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly unitPrice: Locator;
  readonly addToCartButton: Locator;
  readonly addedToCartAlert: Locator;

  constructor(page: Page) {
    this.unitPrice = page.locator('[data-test="unit-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.addedToCartAlert = page.getByRole('alert', { name: 'Product added to shopping' });
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
