import { test, expect } from '@playwright/test';
import { WSLiveOpsPage } from '../../pages/webShop/WSLiveOpsPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/liveOps/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/liveOps/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/liveOps/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/liveOps/mobile';
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

test('A - WS LiveOps Desktop visual should match Figma', async ({ page }) => {
  const wsLiveOps = new WSLiveOpsPage(page, 'desktop');
  await wsLiveOps.goto();
  await scrollPage(page);
  const buffer = await wsLiveOps.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLiveOps/wsLiveOpsDesktopFigma.png',
    actualPath: `${diffDir}/wsLiveOpsDesktop-actual.png`,
    diffPath: `${diffDir}/wsLiveOpsDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsLiveOpsDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLiveOpsDesktop-report.html`,
    pageName: 'WS LiveOps Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS LiveOps Laptop visual should match Figma', async ({ page }) => {
  const wsLiveOps = new WSLiveOpsPage(page, 'laptop');
  await wsLiveOps.goto();
  await scrollPage(page);
  const buffer = await wsLiveOps.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLiveOps/wsLiveOpsLaptopFigma.png',
    actualPath: `${diffDir}/wsLiveOpsLaptop-actual.png`,
    diffPath: `${diffDir}/wsLiveOpsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsLiveOpsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLiveOpsLaptop-report.html`,
    pageName: 'WS LiveOps Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS LiveOps Tablet visual should match Figma', async ({ page }) => {
  const wsLiveOps = new WSLiveOpsPage(page, 'tablet');
  await wsLiveOps.goto();
  await scrollPage(page);
  const buffer = await wsLiveOps.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLiveOps/wsLiveOpsTabletFigma.png',
    actualPath: `${diffDir}/wsLiveOpsTablet-actual.png`,
    diffPath: `${diffDir}/wsLiveOpsTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsLiveOpsTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLiveOpsTablet-report.html`,
    pageName: 'WS LiveOps Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS LiveOps Mobile visual should match Figma', async ({ page }) => {
  const wsLiveOps = new WSLiveOpsPage(page, 'mobile');
  await wsLiveOps.goto();
  await scrollPage(page);
  const buffer = await wsLiveOps.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLiveOps/wsLiveOpsMobileFigma.png',
    actualPath: `${diffDir}/wsLiveOpsMobile-actual.png`,
    diffPath: `${diffDir}/wsLiveOpsMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsLiveOpsMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLiveOpsMobile-report.html`,
    pageName: 'WS LiveOps Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined WS LiveOps multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/wsLiveOpsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS LiveOps',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsLiveOpsDesktop-expected.png',
        actualImage: 'wsLiveOpsDesktop-actual.png',
        diffImage: 'wsLiveOpsDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsLiveOpsLaptop-expected.png',
        actualImage: 'wsLiveOpsLaptop-actual.png',
        diffImage: 'wsLiveOpsLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsLiveOpsTablet-expected.png',
        actualImage: 'wsLiveOpsTablet-actual.png',
        diffImage: 'wsLiveOpsTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsLiveOpsMobile-expected.png',
        actualImage: 'wsLiveOpsMobile-actual.png',
        diffImage: 'wsLiveOpsMobile-diff.png'
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
