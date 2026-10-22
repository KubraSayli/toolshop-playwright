import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly quantity: Locator;
  readonly productPrice: Locator;
  readonly total: Locator;
  readonly quantityUpdatedAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator('[data-test="product-title"]');
    this.quantity = page.locator('[data-test="product-quantity"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.total = page.locator('[data-test="cart-total"]');
    this.quantityUpdatedAlert = page.getByRole('alert', { name: 'Product quantity updated.' });
  }

  async open() {
    await this.page.locator('[data-test="nav-cart"]').click();
  }

  async updateQuantity(quantity: number) {
    await this.quantity.fill(String(quantity));
    await this.quantity.press('Enter');
  }
}
