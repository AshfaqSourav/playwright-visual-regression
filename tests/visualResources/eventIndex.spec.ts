import { test, expect } from '@playwright/test';
import { EventIndexPage } from '../../pages/resources/EventIndexPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/eventIndex/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/eventIndex/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/eventIndex/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/eventIndex/mobile';
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

test('A - eventIndex Desktop visual should match Figma', async ({ page }) => {
  const eventIndex = new EventIndexPage(page, 'desktop');
  await eventIndex.goto();
  await scrollPage(page);
  const buffer = await eventIndex.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventIndex/eventIndexDesktopFigma.png',
    actualPath: `${diffDir}/eventIndexDesktop-actual.png`,
    diffPath: `${diffDir}/eventIndexDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/eventIndexDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventIndexDesktop-report.html`,
    pageName: 'eventIndex Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - eventIndex Laptop visual should match Figma', async ({ page }) => {
  const eventIndex = new EventIndexPage(page, 'laptop');
  await eventIndex.goto();
  await scrollPage(page);
  const buffer = await eventIndex.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventIndex/eventIndexLaptopFigma.png',
    actualPath: `${diffDir}/eventIndexLaptop-actual.png`,
    diffPath: `${diffDir}/eventIndexLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/eventIndexLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventIndexLaptop-report.html`,
    pageName: 'eventIndex Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - eventIndex Tablet visual should match Figma', async ({ page }) => {
  const eventIndex = new EventIndexPage(page, 'tablet');
  await eventIndex.goto();
  await scrollPage(page);
  const buffer = await eventIndex.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventIndex/eventIndexTabletFigma.png',
    actualPath: `${diffDir}/eventIndexTablet-actual.png`,
    diffPath: `${diffDir}/eventIndexTablet-diff.png`,
    expectedCopyPath: `${diffDir}/eventIndexTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventIndexTablet-report.html`,
    pageName: 'eventIndex Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - eventIndex Mobile visual should match Figma', async ({ page }) => {
  const eventIndex = new EventIndexPage(page, 'mobile');
  await eventIndex.goto();
  await scrollPage(page);
  const buffer = await eventIndex.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventIndex/eventIndexMobileFigma.png',
    actualPath: `${diffDir}/eventIndexMobile-actual.png`,
    diffPath: `${diffDir}/eventIndexMobile-diff.png`,
    expectedCopyPath: `${diffDir}/eventIndexMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventIndexMobile-report.html`,
    pageName: 'eventIndex Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined eventIndex multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/eventIndexMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'eventIndex',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'eventIndexDesktop-expected.png',
        actualImage: 'eventIndexDesktop-actual.png',
        diffImage: 'eventIndexDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'eventIndexLaptop-expected.png',
        actualImage: 'eventIndexLaptop-actual.png',
        diffImage: 'eventIndexLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'eventIndexTablet-expected.png',
        actualImage: 'eventIndexTablet-actual.png',
        diffImage: 'eventIndexTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'eventIndexMobile-expected.png',
        actualImage: 'eventIndexMobile-actual.png',
        diffImage: 'eventIndexMobile-diff.png'
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
