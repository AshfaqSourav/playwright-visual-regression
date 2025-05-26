// /tests/visualWebShop/wsInstant.spec.ts

import { test, expect } from '@playwright/test';
import { WSInstantPage } from '../../pages/webShop/WSInstantPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/instant/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/instant/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/instant/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/instant/mobile';
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

test('A - WS Instant Desktop visual should match Figma', async ({ page }) => {
  const wsInstant = new WSInstantPage(page, 'desktop');
  await wsInstant.goto();
  await scrollPage(page);
  const buffer = await wsInstant.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsInstant/wsInstantDesktopFigma.png',
    actualPath: `${diffDir}/wsInstantDesktop-actual.png`,
    diffPath: `${diffDir}/wsInstantDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsInstantDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsInstantDesktop-report.html`,
    pageName: 'WS Instant Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS Instant Laptop visual should match Figma', async ({ page }) => {
  const wsInstant = new WSInstantPage(page, 'laptop');
  await wsInstant.goto();
  await scrollPage(page);
  const buffer = await wsInstant.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsInstant/wsInstantLaptopFigma.png',
    actualPath: `${diffDir}/wsInstantLaptop-actual.png`,
    diffPath: `${diffDir}/wsInstantLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsInstantLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsInstantLaptop-report.html`,
    pageName: 'WS Instant Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS Instant Tablet visual should match Figma', async ({ page }) => {
  const wsInstant = new WSInstantPage(page, 'tablet');
  await wsInstant.goto();
  await scrollPage(page);
  const buffer = await wsInstant.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsInstant/wsInstantTabletFigma.png',
    actualPath: `${diffDir}/wsInstantTablet-actual.png`,
    diffPath: `${diffDir}/wsInstantTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsInstantTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsInstantTablet-report.html`,
    pageName: 'WS Instant Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS Instant Mobile visual should match Figma', async ({ page }) => {
  const wsInstant = new WSInstantPage(page, 'mobile');
  await wsInstant.goto();
  await scrollPage(page);
  const buffer = await wsInstant.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsInstant/wsInstantMobileFigma.png',
    actualPath: `${diffDir}/wsInstantMobile-actual.png`,
    diffPath: `${diffDir}/wsInstantMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsInstantMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsInstantMobile-report.html`,
    pageName: 'WS Instant Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined WS Instant multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/wsInstantMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS Instant',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsInstantDesktop-expected.png',
        actualImage: 'wsInstantDesktop-actual.png',
        diffImage: 'wsInstantDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsInstantLaptop-expected.png',
        actualImage: 'wsInstantLaptop-actual.png',
        diffImage: 'wsInstantLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsInstantTablet-expected.png',
        actualImage: 'wsInstantTablet-actual.png',
        diffImage: 'wsInstantTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsInstantMobile-expected.png',
        actualImage: 'wsInstantMobile-actual.png',
        diffImage: 'wsInstantMobile-diff.png'
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
