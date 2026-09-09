import { expect, test, type Page } from '@playwright/test';
import { loginAsWriter, submitForm, waitForLoaded } from '../utils/e2e/helpers';

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
    await submitForm(page);

    await expect(page.getByText(reason, { exact: true })).toBeVisible();
    await expect(
      page.getByText('1 ไม่เห็นด้วย', { exact: true })
    ).toBeVisible();
    await expect(page.getByText('1 ความคิดเห็น')).toBeVisible();
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
    await parent.locator('svg').click();

    // The view buttons also exist in the topic card, so scope them to the modal.
    const modal = page
      .locator('section.z-30')
      .filter({ hasText: 'เพิ่มข้อถกเถียงต่อยอด' });
    await expect(modal).toBeVisible();
    await modal
      .getByRole('button', { name: 'เห็นด้วยบ้าง', exact: true })
      .click();
    await page.locator('#topic-title-text-area').fill(reply);
    await submitForm(page);

    await expect(page.getByText(reply, { exact: true })).toBeVisible();
  });
});
