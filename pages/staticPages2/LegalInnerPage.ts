import { Page } from '@playwright/test';
import dotenv from 'dotenv';
import { getEnabledViewports, ViewportType } from '../../utils/viewPorts';
import { scrollPage } from '../../utils/scrollUtils';
dotenv.config();

const viewportSizes = getEnabledViewports(4); // 👈 Update count or keys as needed

export class LegalInnerPage {
  constructor(private page: Page, private viewport: ViewportType) {}

  async goto() {
    await this.page.goto(`${process.env.BASEURL}/eula`, {
      waitUntil: 'networkidle'
    });
    await this.page.waitForTimeout(1000);
  }

  async takeScreenshot(): Promise<Buffer> {
    const size = viewportSizes[this.viewport];
    await this.page.setViewportSize(size);
    await this.page.waitForTimeout(100);
    await scrollPage(this.page);
    return await this.page.screenshot({ fullPage: true });
  }
}
