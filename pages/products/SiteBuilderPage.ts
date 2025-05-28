import { Page } from '@playwright/test';
import { getEnabledViewports, ViewportType } from '../../utils/viewPorts';
import dotenv from 'dotenv';
dotenv.config();

const viewportSizes = getEnabledViewports(4); 

export class SiteBuilderPage {
  constructor(private page: Page, private viewport: ViewportType) {}

  async goto() {
    await this.page.goto(`${process.env.BASEURL}/site-builder`, {
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