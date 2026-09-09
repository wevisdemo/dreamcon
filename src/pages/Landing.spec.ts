import { expect, test } from '@playwright/test';

test('shows the three latest topics and links onward', async ({ page }) => {
  await page.goto('/');

  const cards = page.locator('#influence .grid > div');
  await expect(cards).toHaveCount(3);
  await expect(cards.first()).toContainText(
    'สสร. ควรมาจากการเลือกตั้งทั้งหมดหรือไม่'
  );

  await cards.first().click();
  await expect(page).toHaveURL('/topics/tp-ssr');
});

test('links to the about page', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'อ่านที่มาของโครงการเพิ่มเติม' })
    .click();
  await expect(page).toHaveURL('/about');
});
