import { expect, test } from '@playwright/test';
import { loginAsAdmin } from '../utils/e2e/helpers';

test('the console redirects anonymous visitors here', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL('/admin/login');
});

test('a wrong password does not reach the console', async ({ page }) => {
  await loginAsAdmin(page, 'wrong-password');

  // Login.tsx navigates without awaiting the sign-in, so the admin page bounces
  // back here; assert on where the URL settles rather than on the first value.
  await expect.poll(() => new URL(page.url()).pathname).toBe('/admin/login');

  // Landing on the login route proves nothing on its own, since that is also
  // where the click started. Re-entering the console proves no session exists.
  await page.goto('/admin');
  await expect(page).toHaveURL('/admin/login');
});

test('the right password reaches the console', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page).toHaveURL('/admin');
});
