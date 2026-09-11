import { expect, test, type Page } from '@playwright/test';
import { loginAsWriter, submitForm, waitForLoaded } from '../utils/e2e/helpers';

const ADD_COMMENT = 'เพิ่มข้อถกเถียงต่อยอด';
const LEAVE_EVENT = 'ถอนวงของฉันออก';

/** Walks up from the reason text to the card that holds the hover controls. */
const commentCard = (page: Page, reason: string) =>
  page.getByText(reason, { exact: true }).locator('../..');

test('renders every nested comment', async ({ page }) => {
  await page.goto('/topics/tp-rights');
  await waitForLoaded(page);

  await expect(
    page.getByRole('heading', {
      name: 'รัฐธรรมนูญควรรับรองเสรีภาพในการแสดงออกอย่างไร',
    })
  ).toBeVisible();

  const reasons = [
    'เสรีภาพในการแสดงออกควรได้รับการรับรองไว้ในหมวดสิทธิเสรีภาพชัดเจน',
    'เห็นด้วย แต่ควรมีขอบเขตเรื่องการใส่ร้ายและข้อมูลเท็จ',
    'การจำกัดขอบเขตอาจถูกใช้เป็นเครื่องมือปิดปากผู้เห็นต่าง',
    'ควรระบุให้ครอบคลุมการแสดงออกทางศิลปะด้วย',
    'ควรเขียนไว้ในกฎหมายลูกมากกว่าเขียนในรัฐธรรมนูญ',
  ];
  for (const reason of reasons) {
    await expect(page.getByText(reason)).toBeVisible();
  }

  // The view headings count root comments only: one agree, one disagree.
  await expect(page.getByText('1 เห็นด้วย', { exact: true })).toBeVisible();
  await expect(page.getByText('0 เห็นด้วยบางส่วน')).toBeVisible();
  await expect(page.getByText('1 ไม่เห็นด้วย', { exact: true })).toBeVisible();
});

test.describe('signed in as the Bangkok writer', () => {
  test.beforeEach(async ({ context }) => {
    await loginAsWriter(context, 'writer-permanent-bangkok');
  });

  test('adds a root comment to a topic that has none', async ({ page }) => {
    const reason = `E2E comment ${Date.now()}`;

    await page.goto('/topics/tp-court');
    await waitForLoaded(page);

    await page
      .getByRole('button', { name: 'ไม่เห็นด้วย', exact: true })
      .click();
    await page.locator('#add-comment-in-topic-card').fill(reason);
    await page.getByRole('button', { name: 'ส่ง' }).click();

    await expect(page.getByText(reason, { exact: true })).toBeVisible();
    await expect(
      page.getByText('1 ไม่เห็นด้วย', { exact: true })
    ).toBeVisible();
    await expect(page.getByText('1 ความคิดเห็น')).toBeVisible();
    await expect(page.getByText('จากวง เวทีกรุงเทพฯ')).toBeVisible();
  });

  test('the only linked event edits and deletes the topic instead of leaving it', async ({
    page,
  }) => {
    await page.goto('/topics/tp-court');
    await waitForLoaded(page);

    await expect(page.getByText('ข้อถกเถียงจาก 1 วงสนทนา')).toBeVisible();
    // Leaving would strip the topic's last event, so only delete is offered.
    await expect(page.getByLabel(LEAVE_EVENT)).toHaveCount(0);

    await page.getByLabel('เมนู').click();
    await expect(page.getByText('แก้ไข', { exact: true })).toBeVisible();
    await expect(page.getByText('ลบ', { exact: true })).toBeVisible();
  });

  test('cannot edit or delete its own topic once another event commented', async ({
    page,
  }) => {
    await page.goto('/topics/tp-parliament');
    await waitForLoaded(page);

    await expect(page.getByText('ข้อถกเถียงจาก 2 วงสนทนา')).toBeVisible();

    await page.getByLabel('เมนู').click();
    await expect(page.getByText('ปักหมุด', { exact: true })).toBeVisible();
    await expect(page.getByText('แก้ไข', { exact: true })).toHaveCount(0);
    await expect(page.getByText('ลบ', { exact: true })).toHaveCount(0);
  });

  test('replying to another event topic links this event through the comment', async ({
    page,
  }) => {
    const reply = `E2E cross-event reply ${Date.now()}`;

    await page.goto('/topics/tp-local');
    await waitForLoaded(page);
    await expect(page.getByText('ข้อถกเถียงจาก 1 วงสนทนา')).toBeVisible();

    const parent = commentCard(
      page,
      'ท้องถิ่นควรจัดเก็บและใช้ภาษีของตัวเองได้ตามสัดส่วนที่ชัดเจน'
    );
    await parent.hover();
    // Not this event's comment, so dnd-kit marks the wrapper aria-disabled and
    // Playwright's actionability check refuses the click; the icon still works.
    await parent.getByLabel(ADD_COMMENT).click({ force: true });
    await page.locator('#topic-title-text-area').fill(reply);
    await submitForm(page);

    await expect(page.getByText(reply, { exact: true })).toBeVisible();
    await expect(page.getByText('ข้อถกเถียงจาก 2 วงสนทนา')).toBeVisible();
    await expect(page.getByText('จากวง เวทีกรุงเทพฯ')).toBeVisible();

    // Linked through a comment only: leaving is blocked while that comment exists.
    await page.getByLabel(LEAVE_EVENT).click();
    await expect(page.getByText('เพราะวงสนทนาของคุณมี')).toBeVisible();
    await expect(page.getByText('ข้อถกเถียงจาก 2 วงสนทนา')).toBeVisible();
  });

  test('replies to an existing comment', async ({ page }) => {
    const reply = `E2E reply ${Date.now()}`;

    await page.goto('/topics/tp-rights');
    await waitForLoaded(page);

    const parent = commentCard(
      page,
      'ควรเขียนไว้ในกฎหมายลูกมากกว่าเขียนในรัฐธรรมนูญ'
    );
    await parent.hover();
    await parent.getByLabel(ADD_COMMENT).click();

    // The view buttons also exist in the topic card, so scope them to the modal.
    const modal = page.locator('section.z-30').filter({ hasText: ADD_COMMENT });
    await expect(modal).toBeVisible();
    await modal
      .getByRole('button', { name: 'เห็นด้วยบ้าง', exact: true })
      .click();
    await page.locator('#topic-title-text-area').fill(reply);
    await submitForm(page);

    await expect(page.getByText(reply, { exact: true })).toBeVisible();
  });

  test('moves a comment with cut and paste, then undoes it', async ({
    page,
  }) => {
    const moved = 'ควรระบุให้ครอบคลุมการแสดงออกทางศิลปะด้วย';
    const disagreeView = page.locator('.view-wrapper').nth(2);

    await page.goto('/topics/tp-rights');
    await waitForLoaded(page);
    await expect(disagreeView.getByText(moved)).toHaveCount(0);

    await commentCard(page, moved).hover();
    await page.keyboard.press('Control+x');
    await expect(page.getByText('คัดลอกไปยังคลิปบอร์ดแล้ว')).toBeVisible();

    await commentCard(
      page,
      'ควรเขียนไว้ในกฎหมายลูกมากกว่าเขียนในรัฐธรรมนูญ'
    ).hover();
    await page.keyboard.press('Control+v');
    await expect(page.getByText('ย้ายแล้ว!')).toBeVisible();
    await expect(disagreeView.getByText(moved)).toBeVisible();

    await waitForLoaded(page);
    await page.keyboard.press('Control+z');
    await expect(disagreeView.getByText(moved)).toHaveCount(0);
    await expect(page.getByText(moved)).toBeVisible();
  });
});

test.describe('signed in as the Online writer', () => {
  const JOIN = 'ใช่ เพิ่มวงของฉัน';
  const eventList = (page: Page) => page.getByText('ข้อถกเถียงจาก');

  test.beforeEach(async ({ context }) => {
    await loginAsWriter(context, 'writer-permanent-online');
  });

  test('joins and leaves a topic of another event', async ({ page }) => {
    await page.goto('/topics/tp-court');
    await waitForLoaded(page);

    await expect(eventList(page)).toHaveText(/ข้อถกเถียงจาก 1 วงสนทนา/);
    await expect(page.locator('#add-comment-in-topic-card')).toHaveCount(0);

    // Not a member yet: no edit and no delete in the menu.
    await page.getByLabel('เมนู').click();
    await expect(page.getByText('ลบ', { exact: true })).toHaveCount(0);
    await page.locator('.MuiBackdrop-root').click();

    await page.getByRole('button', { name: JOIN }).click();
    await waitForLoaded(page);

    await expect(eventList(page)).toHaveText(/ข้อถกเถียงจาก 2 วงสนทนา/);
    await expect(page.getByText('ความคิดเห็นของ')).toBeVisible();
    await expect(page.getByText('เวทีออนไลน์').first()).toBeVisible();

    // Two events are linked now, so neither can edit or delete the topic.
    await page.getByLabel('เมนู').click();
    await expect(page.getByText('แก้ไข', { exact: true })).toHaveCount(0);
    await expect(page.getByText('ลบ', { exact: true })).toHaveCount(0);
    await page.locator('.MuiBackdrop-root').click();

    await page.getByLabel(LEAVE_EVENT).click();
    await waitForLoaded(page);

    await expect(eventList(page)).toHaveText(/ข้อถกเถียงจาก 1 วงสนทนา/);
    await expect(page.getByRole('button', { name: JOIN })).toBeVisible();
  });

  test('cannot leave a topic its own event has commented on', async ({
    page,
  }) => {
    await page.goto('/topics/tp-parliament');
    await waitForLoaded(page);

    await expect(eventList(page)).toHaveText(/ข้อถกเถียงจาก 2 วงสนทนา/);

    await page.getByLabel(LEAVE_EVENT).click();

    const alert = page.getByText(
      'เพราะวงสนทนาของคุณมี 1 ความคิดเห็นในข้อถกเถียงนี้'
    );
    await expect(alert).toBeVisible();
    await expect(eventList(page)).toHaveText(/ข้อถกเถียงจาก 2 วงสนทนา/);
    await expect(alert).toBeHidden({ timeout: 5000 });
  });
});
