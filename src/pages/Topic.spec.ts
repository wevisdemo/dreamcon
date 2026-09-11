import { expect, test, type Page } from '@playwright/test';
import { loginAsWriter, waitForLoaded } from '../utils/e2e/helpers';

const JOIN = 'ใช่ เพิ่มวงของฉัน';
const ADD_COMMENT = 'เพิ่มข้อถกเถียงต่อยอด';
const LEAVE_EVENT = 'ถอนวงของฉันออก';
const MENU = 'เมนู';

/** Walks up from the reason text to the card that holds the hover controls. */
const commentCard = (page: Page, reason: string) =>
  page.getByText(reason, { exact: true }).locator('../..');

/** The `จากวง` event list rendered right below a comment card. */
const commentEvents = (page: Page, reason: string) =>
  commentCard(page, reason).locator('xpath=../following-sibling::div[1]');

const topicEvents = (page: Page) =>
  page.locator('.comment-section').getByText('ข้อถกเถียงจาก').locator('..');

/** Comment cards keep their own hidden menu icon, so scope this one to the topic card. */
const topicMenu = (page: Page) => page.locator('.shadow-card').getByLabel(MENU);

const modal = (page: Page) => page.locator('section.z-30');

const closeModal = (page: Page) => modal(page).getByText('ยกเลิก').click();

/**
 * Not this event's comment, so dnd-kit marks the wrapper aria-disabled and
 * Playwright's actionability check refuses the click; the icon still works.
 */
const openAddCommentModal = async (page: Page, reason: string) => {
  const card = commentCard(page, reason);
  await card.hover();
  await card.getByLabel(ADD_COMMENT).click({ force: true });
  await expect(modal(page).getByText('ยกเลิก')).toBeVisible();
};

const submitComment = async (page: Page, reason: string) => {
  await page.locator('#add-comment-in-modal').fill(reason);
  await modal(page).getByRole('button', { name: 'ส่ง' }).click();
};

test('renders every nested comment as its own bubble', async ({ page }) => {
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
    await expect(commentCard(page, reason)).toHaveClass(/rounded-2xl/);
    await expect(commentEvents(page, reason)).toHaveText(
      /^จากวง\s*เวทีกรุงเทพฯ$/
    );
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
    await expect(commentEvents(page, reason)).toHaveText(
      /^จากวง\s*เวทีกรุงเทพฯ$/
    );
  });

  test('the only linked event edits and deletes the topic instead of leaving it', async ({
    page,
  }) => {
    await page.goto('/topics/tp-court');
    await waitForLoaded(page);

    await expect(page.getByText('ข้อถกเถียงจาก 1 วงสนทนา')).toBeVisible();
    // Leaving would strip the topic's last event, so only delete is offered.
    await expect(page.getByLabel(LEAVE_EVENT)).toHaveCount(0);

    await topicMenu(page).click();
    await expect(page.getByText('แก้ไข', { exact: true })).toBeVisible();
    await expect(page.getByText('ลบ', { exact: true })).toBeVisible();
  });

  test('cannot edit or delete its own topic once another event commented', async ({
    page,
  }) => {
    await page.goto('/topics/tp-parliament');
    await waitForLoaded(page);

    await expect(page.getByText('ข้อถกเถียงจาก 2 วงสนทนา')).toBeVisible();

    await topicMenu(page).click();
    await expect(page.getByText('ปักหมุด', { exact: true })).toBeVisible();
    await expect(page.getByText('แก้ไข', { exact: true })).toHaveCount(0);
    await expect(page.getByText('ลบ', { exact: true })).toHaveCount(0);
  });

  test('cannot edit or delete its own comment once another event replied or joined', async ({
    page,
  }) => {
    await page.goto('/topics/tp-parliament');
    await waitForLoaded(page);

    const own = commentCard(
      page,
      'สมาชิกวุฒิสภาควรมาจากการเลือกตั้งโดยตรงทั้งหมด'
    );
    await own.hover();
    await expect(own.getByLabel(MENU)).toBeVisible();

    for (const reason of [
      'ควรยกเลิกวุฒิสภาและใช้สภาเดี่ยว',
      'ควรให้ประชาชนลงประชามติรับรองรายชื่อสมาชิกวุฒิสภา',
    ]) {
      const shared = commentCard(page, reason);
      await shared.hover();
      await expect(shared.getByLabel(ADD_COMMENT)).toBeVisible();
      await expect(shared.getByLabel(MENU)).toHaveCount(0);
    }

    // The author event cannot leave either, or the joined event would inherit the comment.
    await expect(
      commentEvents(
        page,
        'ควรให้ประชาชนลงประชามติรับรองรายชื่อสมาชิกวุฒิสภา'
      ).getByLabel(LEAVE_EVENT)
    ).toHaveCount(0);
  });

  test('replying to another event comment joins it first', async ({ page }) => {
    const parent =
      'ท้องถิ่นควรจัดเก็บและใช้ภาษีของตัวเองได้ตามสัดส่วนที่ชัดเจน';
    const reply = `E2E cross-event reply ${Date.now()}`;

    await page.goto('/topics/tp-local');
    await waitForLoaded(page);
    await expect(page.getByText('ข้อถกเถียงจาก 1 วงสนทนา')).toBeVisible();

    await openAddCommentModal(page, parent);
    await expect(modal(page)).toContainText('เพิ่มวงสนทนา');
    await expect(page.locator('#add-comment-in-modal')).toHaveCount(0);

    await modal(page).getByRole('button', { name: JOIN }).click();
    await waitForLoaded(page);
    await expect(modal(page)).toContainText('เพิ่มความคิดเห็น');
    await submitComment(page, reply);
    await closeModal(page);

    await expect(page.getByText(reply, { exact: true })).toBeVisible();
    await expect(page.getByText('ข้อถกเถียงจาก 2 วงสนทนา')).toBeVisible();
    await expect(commentEvents(page, reply)).toHaveText(
      /^จากวง\s*เวทีกรุงเทพฯ$/
    );
    await expect(commentEvents(page, parent)).toHaveText(
      /เวทีเชียงใหม่\s*\|\s*เวทีกรุงเทพฯ/
    );

    // Linked through a comment only: leaving is blocked while that comment exists.
    await topicEvents(page).getByLabel(LEAVE_EVENT).click();
    await expect(page.getByText('เพราะวงสนทนาของคุณมี')).toBeVisible();
    await expect(page.getByText('ข้อถกเถียงจาก 2 วงสนทนา')).toBeVisible();
  });

  test('replies to an existing comment', async ({ page }) => {
    const reply = `E2E reply ${Date.now()}`;

    await page.goto('/topics/tp-rights');
    await waitForLoaded(page);

    await openAddCommentModal(
      page,
      'ควรเขียนไว้ในกฎหมายลูกมากกว่าเขียนในรัฐธรรมนูญ'
    );
    await expect(modal(page)).toContainText('เพิ่มความคิดเห็น');
    // The view buttons also exist in the topic card, so scope them to the modal.
    await modal(page)
      .getByRole('button', { name: 'เห็นด้วยบ้าง', exact: true })
      .click();
    await submitComment(page, reply);

    await expect(page.getByText(reply, { exact: true })).toBeVisible();

    // The modal stays open on an empty form, ready for another reply to the same parent.
    await expect(page.locator('#add-comment-in-modal')).toHaveValue('');
    const secondReply = `${reply} again`;
    await submitComment(page, secondReply);
    await expect(page.getByText(secondReply, { exact: true })).toBeVisible();
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
    await page.getByLabel(MENU).click();
    await expect(page.getByText('ลบ', { exact: true })).toHaveCount(0);
    await page.locator('.MuiBackdrop-root').click();

    await page.getByRole('button', { name: JOIN }).click();
    await waitForLoaded(page);

    await expect(eventList(page)).toHaveText(/ข้อถกเถียงจาก 2 วงสนทนา/);
    await expect(page.getByText('ความคิดเห็นของ')).toBeVisible();
    await expect(page.getByText('เวทีออนไลน์').first()).toBeVisible();

    // Two events are linked now, so neither can edit or delete the topic.
    await page.getByLabel(MENU).click();
    await expect(page.getByText('แก้ไข', { exact: true })).toHaveCount(0);
    await expect(page.getByText('ลบ', { exact: true })).toHaveCount(0);
    await page.locator('.MuiBackdrop-root').click();

    await topicEvents(page).getByLabel(LEAVE_EVENT).click();
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

    await topicEvents(page).getByLabel(LEAVE_EVENT).click();

    const alert = page.getByText(
      'เพราะวงสนทนาของคุณมี 2 ความคิดเห็นในข้อถกเถียงนี้'
    );
    await expect(alert).toBeVisible();
    await expect(eventList(page)).toHaveText(/ข้อถกเถียงจาก 2 วงสนทนา/);
    await expect(alert).toBeHidden({ timeout: 5000 });
  });

  test('cannot leave a comment its own event replied to', async ({ page }) => {
    const reason = 'ควรยกเลิกวุฒิสภาและใช้สภาเดี่ยว';

    await page.goto('/topics/tp-parliament');
    await waitForLoaded(page);

    const events = commentEvents(page, reason);
    await expect(events).toHaveText(/เวทีกรุงเทพฯ\s*\|\s*เวทีออนไลน์/);

    await events.getByLabel(LEAVE_EVENT).click({ force: true });

    await expect(
      page.getByText('เพราะวงสนทนาของคุณมี 1 ความคิดเห็นต่อยอดในความคิดเห็นนี้')
    ).toBeVisible();
    await expect(events).toHaveText(/เวทีกรุงเทพฯ\s*\|\s*เวทีออนไลน์/);
  });

  test('leaves a joined comment, then joins it back without commenting', async ({
    page,
  }) => {
    const reason = 'ควรให้ประชาชนลงประชามติรับรองรายชื่อสมาชิกวุฒิสภา';

    await page.goto('/topics/tp-parliament');
    await waitForLoaded(page);

    const events = commentEvents(page, reason);
    await expect(events).toHaveText(/เวทีกรุงเทพฯ\s*\|\s*เวทีออนไลน์/);

    await events.getByLabel(LEAVE_EVENT).click({ force: true });
    await expect(events).toHaveText(/^จากวง\s*เวทีกรุงเทพฯ$/);

    await openAddCommentModal(page, reason);
    await expect(modal(page)).toContainText('เพิ่มวงสนทนา');
    const modalEvents = modal(page).getByText('จากวงสนทนา:').locator('..');
    await expect(modalEvents).toHaveText(/^จากวงสนทนา:\s*เวทีกรุงเทพฯ$/);

    await modal(page).getByRole('button', { name: JOIN }).click();
    await waitForLoaded(page);
    await expect(modalEvents).toHaveText(/เวทีกรุงเทพฯ\s*\|\s*เวทีออนไลน์/);
    await expect(modal(page)).toContainText('เพิ่มความคิดเห็น');

    await modal(page).getByText('ยกเลิก').click();
    await expect(modal(page).getByText('ยกเลิก')).toHaveCount(0);
    await expect(events).toHaveText(/เวทีกรุงเทพฯ\s*\|\s*เวทีออนไลน์/);
  });
});
