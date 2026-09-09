import { expect, type BrowserContext, type Page } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../firebaseEmulator';

export const BASE_URL = 'http://localhost:5173';

export const TOPIC_CARDS = '.MuiMasonry-root > div';

/**
 * Set the writer cookie directly instead of going through `/topics?writer=<id>`,
 * which costs an extra page load and a redirect on every test.
 */
export async function loginAsWriter(context: BrowserContext, writerId: string) {
  await context.addCookies([
    { name: 'authToken', value: writerId, url: BASE_URL },
  ]);
}

export async function loginAsAdmin(page: Page, password = ADMIN_PASSWORD) {
  await page.goto('/admin/login');
  await page.locator('input[name=username]').fill(ADMIN_EMAIL);
  await page.locator('input[name=password]').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/** Topic and comment forms submit through an upload icon, not a button. */
export const submitForm = (page: Page) =>
  page.locator('img[alt="upload-icon"]').click();

/** `FullPageLoader` is a full-screen overlay that swallows clicks while any hook is loading. */
export async function waitForLoaded(page: Page) {
  await expect(page.locator('.animate-spin')).toHaveCount(0);
}

export async function selectDropdown(page: Page, option: string) {
  await page.locator('.dropdown-toggle').click();
  await page.locator('.dropdown-item', { hasText: option }).first().click();
}
