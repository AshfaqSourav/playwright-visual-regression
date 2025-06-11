import { Page } from '@playwright/test';
import { getEnabledViewports, ViewportType } from '../../utils/viewPorts';
import { scrollPage } from '../../utils/scrollUtils';
import dotenv from 'dotenv';
dotenv.config();

const viewportSizes = getEnabledViewports(4); 

export class ShopBuilderPage {
  constructor(private page: Page, private viewport: ViewportType) {}

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/in-game-services`, {
      waitUntil: 'networkidle'
    });
    await this.page.waitForTimeout(2000);
  }

  async takeScreenshot(): Promise<Buffer> {
    const size = viewportSizes[this.viewport];
    await this.page.setViewportSize(size);
    await scrollPage(this.page);
    return await this.page.screenshot({ fullPage: true });
  }
}