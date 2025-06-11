import { test, expect } from '@playwright/test';
import { PreOrdersPage } from '../../pages/XpsLandingPages/PreOrdersPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/xpsLandingPages/preOrders/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/xpsLandingPages/preOrders/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/xpsLandingPages/preOrders/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/xpsLandingPages/preOrders/mobile';
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

test('A - preOrders Desktop visual should match Figma', async ({ page }) => {
  const preOrders = new PreOrdersPage(page, 'desktop');
  await preOrders.goto();
  await scrollPage(page);
  const buffer = await preOrders.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/preOrders/preOrdersDesktopFigma.png',
    actualPath: `${diffDir}/preOrdersDesktop-actual.png`,
    diffPath: `${diffDir}/preOrdersDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/preOrdersDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/preOrdersDesktop-report.html`,
    pageName: 'preOrders Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - preOrders Laptop visual should match Figma', async ({ page }) => {
  const preOrders = new PreOrdersPage(page, 'laptop');
  await preOrders.goto();
  await scrollPage(page);
  const buffer = await preOrders.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/preOrders/preOrdersLaptopFigma.png',
    actualPath: `${diffDir}/preOrdersLaptop-actual.png`,
    diffPath: `${diffDir}/preOrdersLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/preOrdersLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/preOrdersLaptop-report.html`,
    pageName: 'preOrders Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - preOrders Tablet visual should match Figma', async ({ page }) => {
  const preOrders = new PreOrdersPage(page, 'tablet');
  await preOrders.goto();
  await scrollPage(page);
  const buffer = await preOrders.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/preOrders/preOrdersTabletFigma.png',
    actualPath: `${diffDir}/preOrdersTablet-actual.png`,
    diffPath: `${diffDir}/preOrdersTablet-diff.png`,
    expectedCopyPath: `${diffDir}/preOrdersTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/preOrdersTablet-report.html`,
    pageName: 'preOrders Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - preOrders Mobile visual should match Figma', async ({ page }) => {
  const preOrders = new PreOrdersPage(page, 'mobile');
  await preOrders.goto();
  await scrollPage(page);
  const buffer = await preOrders.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/preOrders/preOrdersMobileFigma.png',
    actualPath: `${diffDir}/preOrdersMobile-actual.png`,
    diffPath: `${diffDir}/preOrdersMobile-diff.png`,
    expectedCopyPath: `${diffDir}/preOrdersMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/preOrdersMobile-report.html`,
    pageName: 'preOrders Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined preOrders multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/preOrdersMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'preOrders',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'preOrdersDesktop-expected.png',
        actualImage: 'preOrdersDesktop-actual.png',
        diffImage: 'preOrdersDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'preOrdersLaptop-expected.png',
        actualImage: 'preOrdersLaptop-actual.png',
        diffImage: 'preOrdersLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'preOrdersTablet-expected.png',
        actualImage: 'preOrdersTablet-actual.png',
        diffImage: 'preOrdersTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'preOrdersMobile-expected.png',
        actualImage: 'preOrdersMobile-actual.png',
        diffImage: 'preOrdersMobile-diff.png'
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
