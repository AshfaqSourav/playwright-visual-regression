import { test, expect } from '@playwright/test';
import { LegalIndexPage } from '../../pages/resources/LegalIndexPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/legalIndex/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/legalIndex/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/legalIndex/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/legalIndex/mobile';
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

test('A - LegalIndex Desktop visual should match Figma', async ({ page }) => {
  const legalIndex = new LegalIndexPage(page, 'desktop');
  await legalIndex.goto();
  await scrollPage(page);
  const buffer = await legalIndex.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalIndex/legalIndexDesktopFigma.png',
    actualPath: `${diffDir}/legalIndexDesktop-actual.png`,
    diffPath: `${diffDir}/legalIndexDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/legalIndexDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalIndexDesktop-report.html`,
    pageName: 'LegalIndex Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - LegalIndex Laptop visual should match Figma', async ({ page }) => {
  const legalIndex = new LegalIndexPage(page, 'laptop');
  await legalIndex.goto();
  await scrollPage(page);
  const buffer = await legalIndex.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalIndex/legalIndexLaptopFigma.png',
    actualPath: `${diffDir}/legalIndexLaptop-actual.png`,
    diffPath: `${diffDir}/legalIndexLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/legalIndexLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalIndexLaptop-report.html`,
    pageName: 'LegalIndex Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - LegalIndex Tablet visual should match Figma', async ({ page }) => {
  const legalIndex = new LegalIndexPage(page, 'tablet');
  await legalIndex.goto();
  await scrollPage(page);
  const buffer = await legalIndex.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalIndex/legalIndexTabletFigma.png',
    actualPath: `${diffDir}/legalIndexTablet-actual.png`,
    diffPath: `${diffDir}/legalIndexTablet-diff.png`,
    expectedCopyPath: `${diffDir}/legalIndexTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalIndexTablet-report.html`,
    pageName: 'LegalIndex Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - LegalIndex Mobile visual should match Figma', async ({ page }) => {
  const legalIndex = new LegalIndexPage(page, 'mobile');
  await legalIndex.goto();
  await scrollPage(page);
  const buffer = await legalIndex.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalIndex/legalIndexMobileFigma.png',
    actualPath: `${diffDir}/legalIndexMobile-actual.png`,
    diffPath: `${diffDir}/legalIndexMobile-diff.png`,
    expectedCopyPath: `${diffDir}/legalIndexMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalIndexMobile-report.html`,
    pageName: 'LegalIndex Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined legalIndex multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/legalIndexMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'LegalIndex',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'legalIndexDesktop-expected.png',
        actualImage: 'legalIndexDesktop-actual.png',
        diffImage: 'legalIndexDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'legalIndexLaptop-expected.png',
        actualImage: 'legalIndexLaptop-actual.png',
        diffImage: 'legalIndexLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'legalIndexTablet-expected.png',
        actualImage: 'legalIndexTablet-actual.png',
        diffImage: 'legalIndexTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'legalIndexMobile-expected.png',
        actualImage: 'legalIndexMobile-actual.png',
        diffImage: 'legalIndexMobile-diff.png'
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
