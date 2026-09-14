import { expect, test, type Page } from '@playwright/test';
import {
  loginAsWriter,
  selectDropdown,
  submitButton,
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

/** Menu labels are `pointer-events: none`; the clickable target is their row. */
const menuAction = (page: Page, label: 'แก้ไข' | 'ลบ') =>
  page.getByText(label, { exact: true }).locator('..').click();

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
    await expect(page.getByLabel('เมนู')).toHaveCount(0);
    await expect(page.getByLabel('เพิ่มข้อถกเถียงต่อยอด')).toHaveCount(0);
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
    await page
      .getByRole('button', { name: 'ฝ่ายตุลาการ', exact: true })
      .click();

    await expect(page.locator(TOPIC_CARDS)).toHaveCount(1);
    await expect(
      page.getByText('ศาลรัฐธรรมนูญควรมีอำนาจตรวจสอบเรื่องใดบ้าง')
    ).toBeVisible();
  });

  test('shows a topic under every one of its categories', async ({ page }) => {
    const twoCategoryTitle = 'ท้องถิ่นควรมีอำนาจจัดเก็บภาษีของตัวเองหรือไม่';

    await page
      .getByRole('button', { name: 'การปกครองส่วนท้องถิ่น', exact: true })
      .click();
    await expect(page.locator(TOPIC_CARDS)).toHaveCount(1);
    await expect(page.getByText(twoCategoryTitle)).toBeVisible();

    await page.getByRole('button', { name: 'สวัสดิการ', exact: true }).click();
    await expect(page.locator(TOPIC_CARDS)).toHaveCount(2);
    await expect(page.getByText(twoCategoryTitle)).toBeVisible();
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
    await expect(page.getByLabel('เมนู')).toHaveCount(0);
  });

  test('can edit its own event topics but not another event topics', async ({
    page,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    await page
      .getByText('รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร')
      .click();
    await page.getByLabel('เมนู').first().click();
    await expect(page.getByText('แก้ไข', { exact: true })).toBeVisible();
    // The popover keeps focus outside itself, so Escape does not close it.
    await page.locator('.MuiBackdrop-root').click();
    await expect(page.locator('.MuiBackdrop-root')).toHaveCount(0);

    await page
      .getByText('ท้องถิ่นควรมีอำนาจจัดเก็บภาษีของตัวเองหรือไม่')
      .click();
    await page.getByLabel('เมนู').first().click();
    await expect(page.getByText('ปักหมุด', { exact: true })).toBeVisible();
    await expect(page.getByText('แก้ไข', { exact: true })).toHaveCount(0);
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
    await selectDropdown(page, 'สิทธิเสรีภาพ', 'การศึกษา');
    await expect(page.locator('.dropdown-toggle')).toHaveText(/\+1/);
    await page.locator('#topic-title-text-area').fill(title);
    await submitForm(page);

    const card = page.getByText(title, { exact: true });
    await expect(card).toBeVisible();

    await card.click();
    await expect(page.locator('.badge')).toHaveText([
      'สิทธิเสรีภาพ',
      'การศึกษา',
    ]);
    await expect(page.getByText('ข้อถกเถียงจาก')).toHaveText(
      /ข้อถกเถียงจาก 1 วงสนทนา/
    );

    await page.getByLabel('เมนู').first().click();
    await menuAction(page, 'แก้ไข');
    await page.locator('#topic-title-text-area').fill(editedTitle);
    await submitForm(page);
    await expect(page.getByText(editedTitle, { exact: true })).toHaveCount(2); // list card + side panel

    await page.getByLabel('เมนู').first().click();
    await menuAction(page, 'ลบ');
    await expect(page.getByText(editedTitle, { exact: true })).toHaveCount(0);
  });

  test('will not submit an empty topic and caps the title at 140 characters', async ({
    page,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    await expect(submitButton(page)).toHaveCount(0);

    const textarea = page.locator('#topic-title-text-area');
    await textarea.fill('x'.repeat(141));
    await expect(textarea).toHaveValue('x'.repeat(140));
    await expect(submitButton(page)).toBeVisible();
  });

  test('enter in the title submits the modal', async ({ page }) => {
    const title = `E2E enter ${Date.now()}`;

    await page.goto('/topics');
    await waitForLoaded(page);

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    await selectDropdown(page, 'สิทธิเสรีภาพ');
    await page.locator('#topic-title-text-area').fill(title);
    await page.keyboard.press('Enter');

    const card = page.getByText(title, { exact: true });
    await expect(card).toBeVisible();

    await card.click();
    await page.getByLabel('เมนู').first().click();
    await menuAction(page, 'ลบ');
    await expect(page.getByText(title, { exact: true })).toHaveCount(0);
  });

  test('the modal closes on backdrop click or escape without growing the page', async ({
    page,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    const pageFits = () =>
      page.evaluate(() => {
        const el = document.scrollingElement as Element;
        return el.scrollHeight <= el.clientHeight;
      });
    const dialog = page.getByRole('dialog');

    expect(await pageFits()).toBe(true);

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    await expect(dialog).toBeVisible();
    expect(await pageFits()).toBe(true);

    await page
      .locator('section.z-30 > div')
      .first()
      .click({ position: { x: 5, y: 5 } });
    await expect(dialog).toHaveCount(0);

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

  test('edits a topic categories from the card in one session', async ({
    page,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    await page
      .getByText('รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร')
      .click();
    await page.getByLabel('เมนู').first().click();
    await menuAction(page, 'แก้ไข');

    await selectDropdown(page, 'การศึกษา', 'สวัสดิการ');
    await expect(page.locator('.dropdown-toggle')).toHaveText(/\+2/);
    await submitForm(page);

    await expect(page.locator('.badge')).toHaveText([
      'สิทธิเสรีภาพ',
      'การศึกษา',
      'สวัสดิการ',
    ]);
    await expect(
      page.getByText('รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร', {
        exact: true,
      })
    ).toHaveCount(2);

    // Restore the seeded categories so later tests still see this topic as seeded.
    await page.getByLabel('เมนู').first().click();
    await menuAction(page, 'แก้ไข');
    await selectDropdown(page, 'การศึกษา', 'สวัสดิการ');
    await submitForm(page);
    await expect(page.locator('.badge')).toHaveText(['สิทธิเสรีภาพ']);
  });

  test('refuses to save a topic card with no category', async ({ page }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    // A topic with no comments, so this writer is allowed to edit it.
    await page.getByText('ศาลรัฐธรรมนูญควรมีอำนาจตรวจสอบเรื่องใดบ้าง').click();
    await page.getByLabel('เมนู').first().click();
    await menuAction(page, 'แก้ไข');

    await selectDropdown(page, 'ฝ่ายตุลาการ'); // unticks the only category
    await submitForm(page);

    await expect(page.getByText('*ยังไม่ได้เลือกหัวข้อ')).toBeVisible();
    await page.getByText('ยกเลิก', { exact: true }).click();
    await expect(page.locator('.badge')).toHaveText(['ฝ่ายตุลาการ']);
  });

  test('cannot combine อื่น ๆ with any other category', async ({ page }) => {
    await page.goto('/topics');
    await waitForLoaded(page);

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    const option = (name: string) =>
      page.locator('.dropdown-item', { hasText: name }).first();

    await page.locator('.dropdown-toggle').click();
    await option('อื่น ๆ').getByRole('checkbox').check();
    await expect(option('สิทธิเสรีภาพ').getByRole('checkbox')).toBeDisabled();

    await option('อื่น ๆ').getByRole('checkbox').uncheck();
    await option('สิทธิเสรีภาพ').getByRole('checkbox').check();
    await expect(option('อื่น ๆ').getByRole('checkbox')).toBeDisabled();
  });

  test('refuses to create a topic without a category', async ({ page }) => {
    await page.goto('/topics');
    await waitForLoaded(page);
    const cardCount = await page.locator(TOPIC_CARDS).count();

    await page.getByRole('button', { name: ADD_TOPIC }).click();
    await page.locator('#topic-title-text-area').fill('ข้อถกเถียงไร้หมวดหมู่');
    await submitForm(page);

    await expect(page.getByText('*ยังไม่ได้เลือกหัวข้อ')).toBeVisible();
    await expect(page.locator(TOPIC_CARDS)).toHaveCount(cardCount);
  });

  test('pastes a comment onto the add-topic button as a new topic, then undoes it', async ({
    page,
  }) => {
    await page.goto('/topics');
    await waitForLoaded(page);
    const cardCount = await page.locator(TOPIC_CARDS).count();

    await page
      .getByText('รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร')
      .click();
    await page
      .locator('.comment-section')
      .getByText('ควรเขียนไว้ในกฎหมายลูกมากกว่าเขียนในรัฐธรรมนูญ', {
        exact: true,
      })
      .locator('../..')
      .hover();
    await page.keyboard.press('Control+x');
    await expect(page.getByText('คัดลอกไปยังคลิปบอร์ดแล้ว')).toBeVisible();

    await page.getByRole('button', { name: ADD_TOPIC }).hover();
    await page.keyboard.press('Control+v');
    await expect(page.getByText('ย้ายแล้ว!')).toBeVisible();
    await expect(page.locator(TOPIC_CARDS)).toHaveCount(cardCount + 1);

    await waitForLoaded(page);
    await page.keyboard.press('Control+z');
    await expect(page.locator(TOPIC_CARDS)).toHaveCount(cardCount);
  });
});
