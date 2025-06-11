import { test, expect } from '@playwright/test';
import { SellGameKeysPage } from '../../pages/XpsLandingPages/SellGameKeysPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/xpsLandingPages/sellGameKeys/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/xpsLandingPages/sellGameKeys/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/xpsLandingPages/sellGameKeys/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/xpsLandingPages/sellGameKeys/mobile';
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

test('A - sellGameKeys Desktop visual should match Figma', async ({ page }) => {
  const sellGameKeys = new SellGameKeysPage(page, 'desktop');
  await sellGameKeys.goto();
  await scrollPage(page);
  const buffer = await sellGameKeys.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellGameKeys/sellGameKeysDesktopFigma.png',
    actualPath: `${diffDir}/sellGameKeysDesktop-actual.png`,
    diffPath: `${diffDir}/sellGameKeysDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/sellGameKeysDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellGameKeysDesktop-report.html`,
    pageName: 'sellGameKeys Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - sellGameKeys Laptop visual should match Figma', async ({ page }) => {
  const sellGameKeys = new SellGameKeysPage(page, 'laptop');
  await sellGameKeys.goto();
  await scrollPage(page);
  const buffer = await sellGameKeys.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellGameKeys/sellGameKeysLaptopFigma.png',
    actualPath: `${diffDir}/sellGameKeysLaptop-actual.png`,
    diffPath: `${diffDir}/sellGameKeysLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/sellGameKeysLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellGameKeysLaptop-report.html`,
    pageName: 'sellGameKeys Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - sellGameKeys Tablet visual should match Figma', async ({ page }) => {
  const sellGameKeys = new SellGameKeysPage(page, 'tablet');
  await sellGameKeys.goto();
  await scrollPage(page);
  const buffer = await sellGameKeys.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellGameKeys/sellGameKeysTabletFigma.png',
    actualPath: `${diffDir}/sellGameKeysTablet-actual.png`,
    diffPath: `${diffDir}/sellGameKeysTablet-diff.png`,
    expectedCopyPath: `${diffDir}/sellGameKeysTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellGameKeysTablet-report.html`,
    pageName: 'sellGameKeys Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - sellGameKeys Mobile visual should match Figma', async ({ page }) => {
  const sellGameKeys = new SellGameKeysPage(page, 'mobile');
  await sellGameKeys.goto();
  await scrollPage(page);
  const buffer = await sellGameKeys.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellGameKeys/sellGameKeysMobileFigma.png',
    actualPath: `${diffDir}/sellGameKeysMobile-actual.png`,
    diffPath: `${diffDir}/sellGameKeysMobile-diff.png`,
    expectedCopyPath: `${diffDir}/sellGameKeysMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellGameKeysMobile-report.html`,
    pageName: 'sellGameKeys Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined sellGameKeys multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/sellGameKeysMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'sellGameKeys',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'sellGameKeysDesktop-expected.png',
        actualImage: 'sellGameKeysDesktop-actual.png',
        diffImage: 'sellGameKeysDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'sellGameKeysLaptop-expected.png',
        actualImage: 'sellGameKeysLaptop-actual.png',
        diffImage: 'sellGameKeysLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'sellGameKeysTablet-expected.png',
        actualImage: 'sellGameKeysTablet-actual.png',
        diffImage: 'sellGameKeysTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'sellGameKeysMobile-expected.png',
        actualImage: 'sellGameKeysMobile-actual.png',
        diffImage: 'sellGameKeysMobile-diff.png'
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
