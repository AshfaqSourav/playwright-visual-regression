import { test, expect } from '@playwright/test';
import { PressKitPage } from '../../pages/staticPages/PressKitPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/pressKit/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/pressKit/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/pressKit/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/pressKit/mobile';
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

test('A - press Kit Desktop visual should match Figma', async ({ page }) => {
  const pressKit = new PressKitPage(page, 'desktop');
  await pressKit.goto();
  await scrollPage(page);
  const buffer = await pressKit.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/pressKit/pressKitDesktopFigma.png',
    actualPath: `${diffDir}/pressKitDesktop-actual.png`,
    diffPath: `${diffDir}/pressKitDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/pressKitDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/pressKitDesktop-report.html`,
    pageName: 'press Kit Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - press Kit Laptop visual should match Figma', async ({ page }) => {
  const pressKit = new PressKitPage(page, 'laptop');
  await pressKit.goto();
  await scrollPage(page);
  const buffer = await pressKit.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/pressKit/pressKitLaptopFigma.png',
    actualPath: `${diffDir}/pressKitLaptop-actual.png`,
    diffPath: `${diffDir}/pressKitLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/pressKitLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/pressKitLaptop-report.html`,
    pageName: 'press Kit Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - press Kit Tablet visual should match Figma', async ({ page }) => {
  const pressKit = new PressKitPage(page, 'tablet');
  await pressKit.goto();
  await scrollPage(page);
  const buffer = await pressKit.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/pressKit/pressKitTabletFigma.png',
    actualPath: `${diffDir}/pressKitTablet-actual.png`,
    diffPath: `${diffDir}/pressKitTablet-diff.png`,
    expectedCopyPath: `${diffDir}/pressKitTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/pressKitTablet-report.html`,
    pageName: 'press Kit Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - press Kit Mobile visual should match Figma', async ({ page }) => {
  const pressKit = new PressKitPage(page, 'mobile');
  await pressKit.goto();
  await scrollPage(page);
  const buffer = await pressKit.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/pressKit/pressKitMobileFigma.png',
    actualPath: `${diffDir}/pressKitMobile-actual.png`,
    diffPath: `${diffDir}/pressKitMobile-diff.png`,
    expectedCopyPath: `${diffDir}/pressKitMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/pressKitMobile-report.html`,
    pageName: 'press Kit Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined pressKit multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/pressKitMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'press Kit',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'pressKitDesktop-expected.png',
        actualImage: 'pressKitDesktop-actual.png',
        diffImage: 'pressKitDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'pressKitLaptop-expected.png',
        actualImage: 'pressKitLaptop-actual.png',
        diffImage: 'pressKitLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'pressKitTablet-expected.png',
        actualImage: 'pressKitTablet-actual.png',
        diffImage: 'pressKitTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'pressKitMobile-expected.png',
        actualImage: 'pressKitMobile-actual.png',
        diffImage: 'pressKitMobile-diff.png'
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
