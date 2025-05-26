import { test, expect } from '@playwright/test';
import { SubscriptionsPage } from '../../pages/products/SubscriptionsPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/products/subscriptions/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/products/subscriptions/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/products/subscriptions/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/products/subscriptions/mobile';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport';
import { scrollPage } from '../../utils/scrollUtils';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const diffDir = './diff_output';
let desktopDiffPixels = 0;
let laptopDiffPixels = 0;
let tabletDiffPixels = 0;
let mobileDiffPixels = 0;

test('A - Subscriptions Desktop visual should match Figma', async ({ page }) => {
  const subscriptions = new SubscriptionsPage(page, 'desktop');
  await subscriptions.goto();
  await scrollPage(page);
  const buffer = await subscriptions.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/subscriptions/subscriptionsDesktopFigma.png',
    actualPath: `${diffDir}/subscriptionsDesktop-actual.png`,
    diffPath: `${diffDir}/subscriptionsDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/subscriptionsDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/subscriptionsDesktop-report.html`,
    pageName: 'Subscriptions Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Subscriptions Laptop visual should match Figma', async ({ page }) => {
  const subscriptions = new SubscriptionsPage(page, 'laptop');
  await subscriptions.goto();
  await scrollPage(page);
  const buffer = await subscriptions.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/subscriptions/subscriptionsLaptopFigma.png',
    actualPath: `${diffDir}/subscriptionsLaptop-actual.png`,
    diffPath: `${diffDir}/subscriptionsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/subscriptionsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/subscriptionsLaptop-report.html`,
    pageName: 'Subscriptions Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Subscriptions Tablet visual should match Figma', async ({ page }) => {
  const subscriptions = new SubscriptionsPage(page, 'tablet');
  await subscriptions.goto();
  await scrollPage(page);
  const buffer = await subscriptions.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/subscriptions/subscriptionsTabletFigma.png',
    actualPath: `${diffDir}/subscriptionsTablet-actual.png`,
    diffPath: `${diffDir}/subscriptionsTablet-diff.png`,
    expectedCopyPath: `${diffDir}/subscriptionsTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/subscriptionsTablet-report.html`,
    pageName: 'Subscriptions Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Subscriptions Mobile visual should match Figma', async ({ page }) => {
  const subscriptions = new SubscriptionsPage(page, 'mobile');
  await subscriptions.goto();
  await scrollPage(page);
  const buffer = await subscriptions.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/subscriptions/subscriptionsMobileFigma.png',
    actualPath: `${diffDir}/subscriptionsMobile-actual.png`,
    diffPath: `${diffDir}/subscriptionsMobile-diff.png`,
    expectedCopyPath: `${diffDir}/subscriptionsMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/subscriptionsMobile-report.html`,
    pageName: 'Subscriptions Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined subscriptions multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/subscriptionsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Subscriptions',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'subscriptionsDesktop-expected.png',
        actualImage: 'subscriptionsDesktop-actual.png',
        diffImage: 'subscriptionsDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'subscriptionsLaptop-expected.png',
        actualImage: 'subscriptionsLaptop-actual.png',
        diffImage: 'subscriptionsLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'subscriptionsTablet-expected.png',
        actualImage: 'subscriptionsTablet-actual.png',
        diffImage: 'subscriptionsTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'subscriptionsMobile-expected.png',
        actualImage: 'subscriptionsMobile-actual.png',
        diffImage: 'subscriptionsMobile-diff.png'
      }
    ]
  });

  if (fs.existsSync(reportPath)) {
    const openCommand =
      process.platform === 'win32'
        ? `start "" "${reportPath}"`
        : process.platform === 'darwin'
        ? `open "${reportPath}"`
        : `xdg-open "${reportPath}"`;

    if (openCommand) {
      await new Promise((resolve) => {
        exec(openCommand, (err) => {
          if (err) console.warn('⚠️ Failed to open browser:', err.message);
          else console.log('✅ Opened visual report in browser');
          resolve(true);
        });
      });
    }
  }
});
