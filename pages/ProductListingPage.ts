import { expect, type Locator, type Page } from '@playwright/test';

export class ProductListingPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productNames: Locator;
  readonly noResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.productNames = page.locator('[data-test="product-name"]');
    this.noResults = page.locator('[data-test="no-results"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
    await expect(this.productNames).not.toHaveCount(0);
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}
