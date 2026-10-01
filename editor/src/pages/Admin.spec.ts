import { expect, test, type Page } from '@playwright/test';
import { loginAsAdmin, TOPIC_CARDS, waitForLoaded } from '../utils/e2e/helpers';
import { EMULATOR_FIREBASE_CONFIG } from '../utils/firebaseEmulator';

const eventCards = (page: Page) => page.getByRole('button', { name: 'แชร์ลิงก์' });

const bangkokCard = (page: Page) =>
  page
    .locator('div.bg-white')
    .filter({ hasText: 'Dream Constitution Bangkok' })
    .first();

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page).toHaveURL('admin');
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

test('the app origin refuses the emulator owner token', async ({ request }) => {
  const writer = `/v1/projects/${EMULATOR_FIREBASE_CONFIG.projectId}/databases/(default)/documents/writers/e2e-owner-probe`;
  const owner = 'Bearer owner';

  expect((await request.patch(writer, { data: {} })).status()).toBe(403);
  expect(
    (
      await request.patch(writer, {
        data: {},
        headers: { Authorization: owner },
      })
    ).status()
  ).toBe(404);
  expect(
    (
      await request.patch(
        `${writer}?$httpHeaders=${encodeURIComponent(`Authorization: ${owner}`)}`,
        { data: {} }
      )
    ).status()
  ).toBe(404);
});

test('creates a new event and shares a created target group type', async ({
  page,
}) => {
  const displayName = `E2E event ${Date.now()}`;
  const submit = page.getByRole('button', { name: 'เพิ่ม', exact: true });

  await page.getByText('เพิ่มวงสนทนา').click();

  await page.getByPlaceholder('ชื่อสั้นๆ ที่จะปรากฏพร้อมข้อถกเถียง').fill(displayName);
  await page.locator('img[alt="Avatar 0"]').click();
  await page.getByPlaceholder('คำอธิบาย').fill('สร้างโดยชุดทดสอบ');
  await page.getByPlaceholder('ชื่อสถานที่และจังหวัด').fill('ที่ไหนสักแห่ง');
  await page.locator('input[type=date]').fill('2026-01-15');
  await page.getByPlaceholder('ตัวเลข').fill('42');
  await page.getByPlaceholder('บรรยายลักษณะของผู้ที่เข้าร่วม').fill('ผู้ทดสอบ');
  await expect(submit).toBeDisabled();

  await page.getByLabel('ชื่อองค์กรที่จัด').click();
  await page.getByRole('button', { name: 'KPI', exact: true }).click();
  await expect(submit).toBeDisabled();

  await page.getByLabel('ประเภทกลุ่มเป้าหมาย').fill('ผู้สูงอายุ');
  await page.getByRole('button', { name: /^สร้าง\s*ผู้สูงอายุ$/ }).click();
  await submit.click();

  await waitForLoaded(page);
  await expect(page.locator('.heading-2')).toHaveText('4');

  await page.getByPlaceholder('ค้นหา').fill(displayName);
  await expect(eventCards(page)).toHaveCount(1);
  await expect(page.getByText(displayName)).toBeVisible();

  await page.getByText('เพิ่มวงสนทนา').click();
  await page.getByLabel('ประเภทกลุ่มเป้าหมาย').click();
  await expect(
    page.getByRole('button', { name: 'ผู้สูงอายุ', exact: true })
  ).toBeVisible();
});

test('an event saved before organizers existed can be edited without them', async ({
  page,
}) => {
  const chiangmaiCard = page
    .locator('div.bg-white')
    .filter({ hasText: 'Dream Constitution Chiang Mai' })
    .first();
  const documentLink = page.getByPlaceholder(
    'เช่น เอกสารกำหนดการ / รายงานสรุปกิจกรรม'
  );

  await chiangmaiCard.getByText('แก้ไขข้อมูล').click();
  await documentLink.fill('https://example.org/docs/chiangmai');
  await page.getByRole('button', { name: 'แก้ไข', exact: true }).click();
  await waitForLoaded(page);

  await chiangmaiCard.getByText('แก้ไขข้อมูล').click();
  await expect(documentLink).toHaveValue('https://example.org/docs/chiangmai');
});

test('organizers cannot be cleared once an event has them', async ({
  page,
}) => {
  await bangkokCard(page).getByText('แก้ไขข้อมูล').click();
  await page.getByRole('button', { name: 'ลบ KPI' }).click();
  await page.getByRole('button', { name: 'ลบ The Active' }).click();

  await expect(
    page.getByRole('button', { name: 'แก้ไข', exact: true })
  ).toBeDisabled();
});
