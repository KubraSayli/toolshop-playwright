import { test, expect } from '../fixtures/test';

test('checkout displays a cart prepared through the API', async ({ request, page, availableProduct, cartPage }) => {
  const apiUrl = 'https://api.practicesoftwaretesting.com';

  const createResponse = await request.post(`${apiUrl}/carts`);
  expect(createResponse.status()).toBe(201);
  const { id: cartId } = await createResponse.json();

  try {
    expect(typeof cartId).toBe('string');
    expect(cartId.length).toBeGreaterThan(0);
    const addResponse = await request.post(`${apiUrl}/carts/${cartId}`, {
      data: { product_id: availableProduct.id, quantity: 2 },
    });
    expect(addResponse.status()).toBe(200);

    await page.goto('https://practicesoftwaretesting.com/');
    await page.evaluate((id) => {
      sessionStorage.setItem('cart_id', id);
    }, cartId);
    await page.goto('https://practicesoftwaretesting.com/checkout');

    await expect(cartPage.productTitle).toHaveText(availableProduct.name);
    await expect(cartPage.quantity).toHaveValue('2');
  } finally {
    const deleteResponse = await request.delete(`${apiUrl}/carts/${cartId}`);
    expect.soft(deleteResponse.status(), 'The test-created cart should be deleted').toBe(204);
  }
});
