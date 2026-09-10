import { expect, test, type Page } from '@playwright/test';
import {
  loginAsWriter,
  selectDropdown,
  submitForm,
  TOPIC_CARDS,
  waitForLoaded,
} from '../utils/e2e/helpers';

const ADD_TOPIC = 'เพิ่มข้อถกเถียงใหม่';

const SEEDED_TITLES = [
  'รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร',
  'ที่มาของสมาชิกวุฒิสภาควรเป็นแบบใด',
  'ศาลรัฐธรรมนูญควรมีอำนาจตรวจสอบเรื่องใดบ้าง',
  'สิทธิในสิ่งแวดล้อมที่ดีควรถูกบัญญัติไว้หรือไม่',
  'รัฐสวัสดิการถ้วนหน้าควรเป็นหน้าที่ของรัฐหรือไม่',
  'ประเด็นอื่น ๆ ที่อยากเห็นในรัฐธรรมนูญฉบับใหม่',
  'ท้องถิ่นควรมีอำนาจจัดเก็บภาษีของตัวเองหรือไม่',
  'รัฐควรรับรองสิทธิการศึกษาฟรีถึงระดับใด',
  'ข้อเสนอที่ยังไม่ได้จัดหมวดหมู่',
  'สสร. ควรมาจากการเลือกตั้งทั้งหมดหรือไม่',
];

/** The event filter avatar has `pointer-events-none`, so the click target is its parent. */
const eventFilter = (page: Page, name: string) =>
  page.locator(`img[alt="Avatar of ${name}"]`).locator('..');

/** Menu icons are `pointer-events: none`; the clickable target is their row. */
const menuAction = (page: Page, icon: 'pen' | 'bin') =>
  page.locator(`img[alt="${icon}-icon"]`).locator('..').click();

test.describe('anonymous', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/topics');
    await waitForLoaded(page);
  });

  test('lists every seeded topic in read-only mode', async ({ page }) => {
    await expect(page.locator(TOPIC_CARDS)).toHaveCount(SEEDED_TITLES.length);
    for (const title of SEEDED_TITLES) {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }

    await expect(page.getByRole('button', { name: ADD_TOPIC })).toHaveCount(0);
    await expect(page.locator('img[alt="menu-icon"]')).toHaveCount(0);
    await expect(page.locator('img[alt="bubble-plus-icon"]')).toHaveCount(0);
  });

  test('filters by event', async ({ page }) => {
    await eventFilter(page, 'เวทีเชียงใหม่').click();

    await expect(page.locator(TOPIC_CARDS)).toHaveCount(4);
    await expect(
      page.getByText('รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร')
    ).toHaveCount(0);
  });

  test('shows the empty state for an event without topics', async ({
    page,
  }) => {
    await eventFilter(page, 'เวทีออนไลน์').click();

    await expect(page.getByText('ยังไม่มีข้อถกเถียง')).toBeVisible();
    await expect(page.locator(TOPIC_CARDS)).toHaveCount(0);
  });

  test('filters by category', async ({ page }) => {
    await page.getByRole('button', { name: 'ศาล รธน.', exact: true }).click();

    await expect(page.locator(TOPIC_CARDS)).toHaveCount(1);
    await expect(
      page.getByText('ศาลรัฐธรรมนูญควรมีอำนาจตรวจสอบเรื่องใดบ้าง')
    ).toBeVisible();
  });

  test('sorts by comment count and by recency', async ({ page }) => {
    await page.getByRole('button', { name: 'มากที่สุด' }).click();
    await expect(page.locator(TOPIC_CARDS).first()).toContainText(
      'ที่มาของสมาชิกวุฒิสภาควรเป็นแบบใด'
    );

    await page.getByRole('button', { name: 'ล่าสุด' }).click();
    await expect(page.locator(TOPIC_CARDS).first()).toContainText(
      'สสร. ควรมาจากการเลือกตั้งทั้งหมดหรือไม่'
    );
  });

  test('searches by title', async ({ page }) => {
    await page.getByPlaceholder('ค้นหา').fill('รัฐสวัสดิการ');

    await expect(page.locator(TOPIC_CARDS)).toHaveCount(1);
    await expect(
      page.getByText('รัฐสวัสดิการถ้วนหน้าควรเป็นหน้าที่ของรัฐหรือไม่')
    ).toBeVisible();
  });
});

test('an invite link logs the writer in and drops the token from the URL', async ({
  page,
  context,
}) => {
  await page.goto('/topics?writer=writer-permanent-bangkok');
  await waitForLoaded(page);

  await expect(page).toHaveURL(/\/topics\?$/);
  const cookie = (await context.cookies()).find(c => c.name === 'authToken');
  expect(cookie?.value).toBe('writer-permanent-bangkok');

  const nav = page.locator('nav');
  await expect(nav.getByText('สร้างข้อถกเถียงของ')).toBeVisible();
  await expect(nav.getByText('เวทีกรุงเทพฯ')).toBeVisible();
  await expect(page.getByRole('button', { name: ADD_TOPIC })).toBeVisible();
});

test.describe('signed in as the Bangkok writer', () => {
  test.beforeEach(async ({ context }) => {
    await loginAsWriter(context, 'writer-permanent-bangkok');
  });

  test('view mode hides every editing affordance', async ({ page }) => {
    await page.goto('/topics?mode=view');
    await waitForLoaded(page);

    await expect(page.getByRole('button', { name: ADD_TOPIC })).toHaveCount(0);
    await expect(page.locator('img[alt="menu-icon"]')).toHaveCount(0);
  });

  test('can edit its own event topics but not another event topics', async ({
    page,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    await page
      .getByText('รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร')
      .click();
    await page.locator('img[alt="menu-icon"]').first().click();
    await expect(page.locator('img[alt="pen-icon"]')).toBeVisible();
    // The popover keeps focus outside itself, so Escape does not close it.
    await page.locator('.MuiBackdrop-root').click();
    await expect(page.locator('.MuiBackdrop-root')).toHaveCount(0);

    await page
      .getByText('ท้องถิ่นควรมีอำนาจจัดเก็บภาษีของตัวเองหรือไม่')
      .click();
    await page.locator('img[alt="menu-icon"]').first().click();
    await expect(page.locator('img[alt="pin-icon"]')).toBeVisible();
    await expect(page.locator('img[alt="pen-icon"]')).toHaveCount(0);
  });

  test('logging out returns the page to read-only', async ({
    page,
    context,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    await page.locator('nav').getByText('เวทีกรุงเทพฯ').click();
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page.getByRole('button', { name: ADD_TOPIC })).toHaveCount(0);
    expect(
      (await context.cookies()).find(c => c.name === 'authToken')
    ).toBeUndefined();
  });

  test('creates, edits and deletes a topic', async ({ page }) => {
    const title = `E2E topic ${Date.now()}`;
    const editedTitle = `${title} edited`;

    await page.goto('/topics');
    await waitForLoaded(page);

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    await selectDropdown(page, 'สิทธิเสรีภาพ');
    await page.locator('#topic-title-text-area').fill(title);
    await submitForm(page);

    const card = page.getByText(title, { exact: true });
    await expect(card).toBeVisible();

    await card.click();
    await expect(page.locator('.badge')).toHaveText('สิทธิเสรีภาพ');
    await expect(page.getByText('ข้อถกเถียงจาก')).toHaveText(
      /ข้อถกเถียงจาก 1 วงสนทนา/
    );

    await page.locator('img[alt="menu-icon"]').first().click();
    await menuAction(page, 'pen');
    await page.locator('#topic-title-text-area').fill(editedTitle);
    await submitForm(page);
    await expect(page.getByText(editedTitle, { exact: true })).toHaveCount(2); // list card + side panel

    await page.locator('img[alt="menu-icon"]').first().click();
    await menuAction(page, 'bin');
    await expect(page.getByText(editedTitle, { exact: true })).toHaveCount(0);
  });

  test('will not submit an empty topic and caps the title at 140 characters', async ({
    page,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    await expect(page.locator('img[alt="upload-icon"]')).toHaveCount(0);

    await page.locator('#topic-title-text-area').fill('x'.repeat(141));
    await expect(page.getByText('140/140')).toBeVisible();
    await expect(page.locator('img[alt="upload-icon"]')).toBeVisible();
  });
});
