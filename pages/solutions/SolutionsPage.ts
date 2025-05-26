import { Page } from '@playwright/test';
import dotenv from 'dotenv';
import { getEnabledViewports, ViewportType } from '../../utils/viewPorts';
dotenv.config();

const viewportSizes = getEnabledViewports(4); // 👈 Update count or keys as needed

export class SolutionsPage {
  constructor(private page: Page, private viewport: ViewportType) {}

  async goto() {
    await this.page.goto(`${process.env.BASEURL}/solutions`, {
      waitUntil: 'networkidle'
    });
    await this.page.waitForTimeout(2000);
  }

  async takeScreenshot(): Promise<Buffer> {
    const size = viewportSizes[this.viewport];
    await this.page.setViewportSize(size);
    return await this.page.screenshot({ fullPage: true });
  }
}
