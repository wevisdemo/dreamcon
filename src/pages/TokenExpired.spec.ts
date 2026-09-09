import { expect, test } from '@playwright/test';

test('an expired invite link lands here', async ({ page }) => {
  await page.goto('/topics?writer=writer-expired-chiangmai');

  await expect(page).toHaveURL('/token-expired');
  await expect(
    page.getByRole('heading', { name: 'Invite Link Expired' })
  ).toBeVisible();
});

test('an unknown invite link lands here', async ({ page }) => {
  await page.goto('/topics?writer=does-not-exist');

  await expect(page).toHaveURL('/token-expired');
});
