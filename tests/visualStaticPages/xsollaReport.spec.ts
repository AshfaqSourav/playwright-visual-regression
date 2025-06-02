import { test, expect } from '@playwright/test';
import { XsollaReportPage } from '../../pages/staticPages/XsollaReportPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/xsollaReport/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/xsollaReport/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/xsollaReport/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/xsollaReport/mobile';
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

test('A - Xsolla Report Desktop visual should match Figma', async ({ page }) => {
  const xsollaReport = new XsollaReportPage(page, 'desktop');
  await xsollaReport.goto();
  await scrollPage(page);
  const buffer = await xsollaReport.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/xsollaReport/xsollaReportDesktopFigma.png',
    actualPath: `${diffDir}/xsollaReportDesktop-actual.png`,
    diffPath: `${diffDir}/xsollaReportDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/xsollaReportDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/xsollaReportDesktop-report.html`,
    pageName: 'Xsolla Report Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Xsolla Report Laptop visual should match Figma', async ({ page }) => {
  const xsollaReport = new XsollaReportPage(page, 'laptop');
  await xsollaReport.goto();
  await scrollPage(page);
  const buffer = await xsollaReport.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/xsollaReport/xsollaReportLaptopFigma.png',
    actualPath: `${diffDir}/xsollaReportLaptop-actual.png`,
    diffPath: `${diffDir}/xsollaReportLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/xsollaReportLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/xsollaReportLaptop-report.html`,
    pageName: 'Xsolla Report Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Xsolla Report Tablet visual should match Figma', async ({ page }) => {
  const xsollaReport = new XsollaReportPage(page, 'tablet');
  await xsollaReport.goto();
  await scrollPage(page);
  const buffer = await xsollaReport.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/xsollaReport/xsollaReportTabletFigma.png',
    actualPath: `${diffDir}/xsollaReportTablet-actual.png`,
    diffPath: `${diffDir}/xsollaReportTablet-diff.png`,
    expectedCopyPath: `${diffDir}/xsollaReportTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/xsollaReportTablet-report.html`,
    pageName: 'Xsolla Report Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Xsolla Report Mobile visual should match Figma', async ({ page }) => {
  const xsollaReport = new XsollaReportPage(page, 'mobile');
  await xsollaReport.goto();
  await scrollPage(page);
  const buffer = await xsollaReport.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/xsollaReport/xsollaReportMobileFigma.png',
    actualPath: `${diffDir}/xsollaReportMobile-actual.png`,
    diffPath: `${diffDir}/xsollaReportMobile-diff.png`,
    expectedCopyPath: `${diffDir}/xsollaReportMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/xsollaReportMobile-report.html`,
    pageName: 'Xsolla Report Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined xsollaReport multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/xsollaReportMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Xsolla Report',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'xsollaReportDesktop-expected.png',
        actualImage: 'xsollaReportDesktop-actual.png',
        diffImage: 'xsollaReportDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'xsollaReportLaptop-expected.png',
        actualImage: 'xsollaReportLaptop-actual.png',
        diffImage: 'xsollaReportLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'xsollaReportTablet-expected.png',
        actualImage: 'xsollaReportTablet-actual.png',
        diffImage: 'xsollaReportTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'xsollaReportMobile-expected.png',
        actualImage: 'xsollaReportMobile-actual.png',
        diffImage: 'xsollaReportMobile-diff.png'
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
