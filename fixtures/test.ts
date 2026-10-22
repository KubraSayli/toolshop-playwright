import { test as base, expect } from '@playwright/test';
import { ProductListingPage } from '../pages/ProductListingPage';

type Product = {
  id: string;
  name: string;
  in_stock: boolean;
  is_rental: boolean;
};

type Fixtures = {
  productListingPage: ProductListingPage;
  availableProduct: Product;
};

export const test = base.extend<Fixtures>({
  availableProduct: async ({ request }, use) => {
    const response = await request.get('https://api.practicesoftwaretesting.com/products/search', {
      params: { q: 'pliers' },
    });
    expect(response.status()).toBe(200);
    const body: { data: Product[] } = await response.json();
    const product = body.data.find((item) => item.in_stock && !item.is_rental);
    if (!product) {
      throw new Error('Test prerequisite failed: no in-stock, non-rental product in the first page of pliers search results.');
    }
    await use(product);
  },
  productListingPage: async ({ page }, use) => {
    const productListingPage = new ProductListingPage(page);
    await use(productListingPage);
  },
});

export { expect } from '@playwright/test';
