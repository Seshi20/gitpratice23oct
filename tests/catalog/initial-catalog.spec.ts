import { test, expect } from '@playwright/test';

test.describe('Catalog and Cart', () => {
  test('Loads the product catalog, adds Brocolli and Cauliflower, and opens the cart', async ({ page }) => {
    // 1. Open the storefront URL in a fresh browser context.
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    await expect(page).toHaveURL(/seleniumPractise\/#\/$/);
    await expect(page.getByRole('heading', { name: 'Brocolli - 1 Kg' })).toBeVisible();

    const products = page.locator('.products > .product');
    await expect(products).toHaveCount(30);
    for (const product of await products.all()) {
      await expect(product.locator('.product-name')).toBeVisible();
      await expect(product.locator('.product-price')).toHaveText(/\d+/);
      await expect(product.locator('input.quantity')).toHaveValue('1');
      await expect(product.getByRole('button', { name: 'ADD TO CART' })).toBeVisible();
    }

    // 2. Verify the header cart summary starts at zero.
    const cartSummary = page.locator('.cart-info');
    await expect(cartSummary).toContainText(/Items\s*:\s*0/);
    await expect(cartSummary).toContainText(/Price\s*:\s*0/);

    // 3. Add one Brocolli and one Cauliflower to the cart.
    await products.filter({ has: page.getByText('Brocolli - 1 Kg', { exact: true }) })
      .getByRole('button', { name: 'ADD TO CART' }).click();
    await products.filter({ has: page.getByText('Cauliflower - 1 Kg', { exact: true }) })
      .getByRole('button', { name: 'ADD TO CART' }).click();
    await expect(cartSummary).toContainText(/Items\s*:\s*2/);
    await expect(cartSummary).toContainText(/Price\s*:\s*180/);

    // 4. Open the cart and verify its line items and total.
    await page.locator('a[href="#"]:has(img[alt="Cart"])').click();
    await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
    await expect(page).toHaveURL(/seleniumPractise\/#\/cart$/);

    const cartRows = page.locator('table tbody tr');
    await expect(cartRows).toHaveCount(2);
    await expect(cartRows.nth(0)).toContainText('Brocolli - 1 Kg');
    await expect(cartRows.nth(0)).toContainText('1');
    await expect(cartRows.nth(0)).toContainText('120');
    await expect(cartRows.nth(1)).toContainText('Cauliflower - 1 Kg');
    await expect(cartRows.nth(1)).toContainText('1');
    await expect(cartRows.nth(1)).toContainText('60');
    await expect(page.getByText('No. of Items : 2')).toBeVisible();
    await expect(page.locator('.totAmt')).toHaveText('180');
    await page.waitForTimeout(3000);
  });
});
