import { Page } from '@playwright/test';
export async function acceptCookiesIfVisible(page: Page) {
  const acceptAllButton = page.getByRole('button', { name: 'Accept All' });

  const isVisible = await acceptAllButton.isVisible().catch(() => false);

  if (isVisible) {
    await acceptAllButton.click();
  }
}
