import { Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

type ViewportType = 'desktop' | 'laptop' | 'tablet' | 'mobile';

const viewportSizes: Record<ViewportType, { width: number; height: number }> = {
  desktop: { width: 1800, height: 1000 },
  laptop: { width: 1440, height: 1000 },
  tablet: { width: 768, height: 1000 },
  mobile: { width: 360, height: 1000 }
};

export class ShopBuilderPage {
  constructor(private page: Page, private viewport: ViewportType) {}

  async goto() {
    await this.page.goto(`${process.env.BASEURL}/shop-builder`, {
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