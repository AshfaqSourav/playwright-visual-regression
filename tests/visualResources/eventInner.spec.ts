import { test, expect } from '@playwright/test';
import { EventInnerPage } from '../../pages/resources/EventInnerPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/eventInner/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/eventInner/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/eventInner/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/eventInner/mobile';
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

test('A - eventInner Desktop visual should match Figma', async ({ page }) => {
  const eventInner = new EventInnerPage(page, 'desktop');
  await eventInner.goto();
  await scrollPage(page);
  const buffer = await eventInner.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventInner/eventInnerDesktopFigma.png',
    actualPath: `${diffDir}/eventInnerDesktop-actual.png`,
    diffPath: `${diffDir}/eventInnerDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/eventInnerDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventInnerDesktop-report.html`,
    pageName: 'eventInner Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - eventInner Laptop visual should match Figma', async ({ page }) => {
  const eventInner = new EventInnerPage(page, 'laptop');
  await eventInner.goto();
  await scrollPage(page);
  const buffer = await eventInner.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventInner/eventInnerLaptopFigma.png',
    actualPath: `${diffDir}/eventInnerLaptop-actual.png`,
    diffPath: `${diffDir}/eventInnerLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/eventInnerLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventInnerLaptop-report.html`,
    pageName: 'eventInner Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - eventInner Tablet visual should match Figma', async ({ page }) => {
  const eventInner = new EventInnerPage(page, 'tablet');
  await eventInner.goto();
  await scrollPage(page);
  const buffer = await eventInner.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventInner/eventInnerTabletFigma.png',
    actualPath: `${diffDir}/eventInnerTablet-actual.png`,
    diffPath: `${diffDir}/eventInnerTablet-diff.png`,
    expectedCopyPath: `${diffDir}/eventInnerTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventInnerTablet-report.html`,
    pageName: 'eventInner Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - eventInner Mobile visual should match Figma', async ({ page }) => {
  const eventInner = new EventInnerPage(page, 'mobile');
  await eventInner.goto();
  await scrollPage(page);
  const buffer = await eventInner.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/eventInner/eventInnerMobileFigma.png',
    actualPath: `${diffDir}/eventInnerMobile-actual.png`,
    diffPath: `${diffDir}/eventInnerMobile-diff.png`,
    expectedCopyPath: `${diffDir}/eventInnerMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/eventInnerMobile-report.html`,
    pageName: 'eventInner Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined eventInner multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/eventInnerMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'eventInner',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'eventInnerDesktop-expected.png',
        actualImage: 'eventInnerDesktop-actual.png',
        diffImage: 'eventInnerDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'eventInnerLaptop-expected.png',
        actualImage: 'eventInnerLaptop-actual.png',
        diffImage: 'eventInnerLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'eventInnerTablet-expected.png',
        actualImage: 'eventInnerTablet-actual.png',
        diffImage: 'eventInnerTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'eventInnerMobile-expected.png',
        actualImage: 'eventInnerMobile-actual.png',
        diffImage: 'eventInnerMobile-diff.png'
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
