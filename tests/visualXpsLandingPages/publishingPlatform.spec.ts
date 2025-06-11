import { test, expect } from '@playwright/test';
import { PublishingPlatformPage } from '../../pages/XpsLandingPages/PublishingPlatformPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/xpsLandingPages/publishingPlatform/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/xpsLandingPages/publishingPlatform/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/xpsLandingPages/publishingPlatform/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/xpsLandingPages/publishingPlatform/mobile';
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

test('A - publishingPlatform Desktop visual should match Figma', async ({ page }) => {
  const publishingPlatform = new PublishingPlatformPage(page, 'desktop');
  await publishingPlatform.goto();
  await scrollPage(page);
  const buffer = await publishingPlatform.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/publishingPlatform/publishingPlatformDesktopFigma.png',
    actualPath: `${diffDir}/publishingPlatformDesktop-actual.png`,
    diffPath: `${diffDir}/publishingPlatformDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/publishingPlatformDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/publishingPlatformDesktop-report.html`,
    pageName: 'publishingPlatform Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - publishingPlatform Laptop visual should match Figma', async ({ page }) => {
  const publishingPlatform = new PublishingPlatformPage(page, 'laptop');
  await publishingPlatform.goto();
  await scrollPage(page);
  const buffer = await publishingPlatform.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/publishingPlatform/publishingPlatformLaptopFigma.png',
    actualPath: `${diffDir}/publishingPlatformLaptop-actual.png`,
    diffPath: `${diffDir}/publishingPlatformLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/publishingPlatformLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/publishingPlatformLaptop-report.html`,
    pageName: 'publishingPlatform Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - publishingPlatform Tablet visual should match Figma', async ({ page }) => {
  const publishingPlatform = new PublishingPlatformPage(page, 'tablet');
  await publishingPlatform.goto();
  await scrollPage(page);
  const buffer = await publishingPlatform.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/publishingPlatform/publishingPlatformTabletFigma.png',
    actualPath: `${diffDir}/publishingPlatformTablet-actual.png`,
    diffPath: `${diffDir}/publishingPlatformTablet-diff.png`,
    expectedCopyPath: `${diffDir}/publishingPlatformTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/publishingPlatformTablet-report.html`,
    pageName: 'publishingPlatform Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - publishingPlatform Mobile visual should match Figma', async ({ page }) => {
  const publishingPlatform = new PublishingPlatformPage(page, 'mobile');
  await publishingPlatform.goto();
  await scrollPage(page);
  const buffer = await publishingPlatform.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/publishingPlatform/publishingPlatformMobileFigma.png',
    actualPath: `${diffDir}/publishingPlatformMobile-actual.png`,
    diffPath: `${diffDir}/publishingPlatformMobile-diff.png`,
    expectedCopyPath: `${diffDir}/publishingPlatformMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/publishingPlatformMobile-report.html`,
    pageName: 'publishingPlatform Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined publishingPlatform multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/publishingPlatformMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'publishingPlatform',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'publishingPlatformDesktop-expected.png',
        actualImage: 'publishingPlatformDesktop-actual.png',
        diffImage: 'publishingPlatformDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'publishingPlatformLaptop-expected.png',
        actualImage: 'publishingPlatformLaptop-actual.png',
        diffImage: 'publishingPlatformLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'publishingPlatformTablet-expected.png',
        actualImage: 'publishingPlatformTablet-actual.png',
        diffImage: 'publishingPlatformTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'publishingPlatformMobile-expected.png',
        actualImage: 'publishingPlatformMobile-actual.png',
        diffImage: 'publishingPlatformMobile-diff.png'
      }
    ]
  });

  if (fs.existsSync(reportPath)) {
    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    const isLinux = process.platform === 'linux';

    const openCommand = isWindows
      ? `start "" "${reportPath}"`
      : isMac
      ? `open "${reportPath}"`
      : isLinux
      ? `xdg-open "${reportPath}"`
      : null;

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
