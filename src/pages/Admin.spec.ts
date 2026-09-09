import { expect, test, type Page } from '@playwright/test';
import { loginAsAdmin, TOPIC_CARDS, waitForLoaded } from '../utils/e2e/helpers';

const eventCards = (page: Page) =>
  page.getByRole('button', { name: 'แชร์ลิงก์' });

const bangkokCard = (page: Page) =>
  page
    .locator('div.bg-white')
    .filter({ hasText: 'Dream Constitution Bangkok' })
    .first();

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page).toHaveURL('/admin');
  await waitForLoaded(page);
});

test('lists the seeded events', async ({ page }) => {
  await expect(page.locator('.heading-2')).toHaveText('3');
  await expect(eventCards(page)).toHaveCount(3);
  await expect(page.getByText('เวทีกรุงเทพฯ')).toBeVisible();
});

test('sharing a link creates a working writer invite', async ({
  page,
  context,
}) => {
  await bangkokCard(page).getByRole('button', { name: 'แชร์ลิงก์' }).click();
  await expect(bangkokCard(page).getByText('คัดลอกแล้ว!')).toBeVisible();

  // The label flips optimistically, before createWriter resolves and writes the
  // clipboard, so poll instead of reading once.
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toMatch(/\/topics\/\?writer=.+/);
  const link = await page.evaluate(() => navigator.clipboard.readText());

  await page.goto(link);
  await waitForLoaded(page);
  await expect(
    page.getByRole('button', { name: 'เพิ่มข้อถกเถียงใหม่' })
  ).toBeVisible();
  expect(
    (await context.cookies()).find(c => c.name === 'authToken')?.value
  ).toBe(new URL(link).searchParams.get('writer'));
});

test('"create a debate" opens the topic page filtered to that event', async ({
  page,
}) => {
  await bangkokCard(page)
    .getByRole('button', { name: 'สร้างข้อถกเถียงของวงสนทนานี้' })
    .click();

  await expect(page).toHaveURL(/\/topics\/\?event=ev-bangkok$/);
  await waitForLoaded(page);
  await expect(
    page.getByRole('button', { name: 'เพิ่มข้อถกเถียงใหม่' })
  ).toBeVisible();
  await expect(page.locator(TOPIC_CARDS)).toHaveCount(6);
});

test('creates a new event', async ({ page }) => {
  const displayName = `E2E event ${Date.now()}`;

  await page.getByText('เพิ่มวงสนทนา').click();

  await page.getByPlaceholder('กรอกชื่อที่แสดง').fill(displayName);
  await page.locator('img[alt="Avatar 0"]').click();
  await page.getByPlaceholder('กรอกชื่อเต็ม ภาษาอังกฤษ').fill('E2E Event');
  await page.getByPlaceholder('กรอกชื่อเต็ม ภาษาไทย').fill('อีทูอี');
  await page.getByPlaceholder('กรอกคำอธิบาย').fill('สร้างโดยชุดทดสอบ');
  await page.getByPlaceholder('กรอกลิงก์ข่าว').fill('https://example.org/e2e');
  await page.getByPlaceholder('กรอกสถานที่').fill('ที่ไหนสักแห่ง');
  await page.locator('input[type=date]').fill('2026-01-15');
  await page.getByPlaceholder('กรอกจำนวนผู้เข้าร่วม').fill('42');
  await page.getByPlaceholder('กรอกกลุ่มเป้าหมาย').fill('ผู้ทดสอบ');
  await page.getByRole('button', { name: 'เพิ่ม', exact: true }).click();

  await waitForLoaded(page);
  await expect(page.locator('.heading-2')).toHaveText('4');

  await page.getByPlaceholder('ค้นหา').fill(displayName);
  await expect(eventCards(page)).toHaveCount(1);
  await expect(page.getByText(displayName)).toBeVisible();
});
