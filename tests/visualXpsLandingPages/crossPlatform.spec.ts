import { test, expect } from '@playwright/test';
import { CrossPlatformPage } from '../../pages/XpsLandingPages/CrossPlatformPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/xpsLandingPages/crossPlatform/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/xpsLandingPages/crossPlatform/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/xpsLandingPages/crossPlatform/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/xpsLandingPages/crossPlatform/mobile';
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

test('A - crossPlatform Desktop visual should match Figma', async ({ page }) => {
  const crossPlatform = new CrossPlatformPage(page, 'desktop');
  await crossPlatform.goto();
  await scrollPage(page);
  const buffer = await crossPlatform.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/crossPlatform/crossPlatformDesktopFigma.png',
    actualPath: `${diffDir}/crossPlatformDesktop-actual.png`,
    diffPath: `${diffDir}/crossPlatformDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/crossPlatformDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/crossPlatformDesktop-report.html`,
    pageName: 'crossPlatform Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - crossPlatform Laptop visual should match Figma', async ({ page }) => {
  const crossPlatform = new CrossPlatformPage(page, 'laptop');
  await crossPlatform.goto();
  await scrollPage(page);
  const buffer = await crossPlatform.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/crossPlatform/crossPlatformLaptopFigma.png',
    actualPath: `${diffDir}/crossPlatformLaptop-actual.png`,
    diffPath: `${diffDir}/crossPlatformLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/crossPlatformLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/crossPlatformLaptop-report.html`,
    pageName: 'crossPlatform Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - crossPlatform Tablet visual should match Figma', async ({ page }) => {
  const crossPlatform = new CrossPlatformPage(page, 'tablet');
  await crossPlatform.goto();
  await scrollPage(page);
  const buffer = await crossPlatform.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/crossPlatform/crossPlatformTabletFigma.png',
    actualPath: `${diffDir}/crossPlatformTablet-actual.png`,
    diffPath: `${diffDir}/crossPlatformTablet-diff.png`,
    expectedCopyPath: `${diffDir}/crossPlatformTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/crossPlatformTablet-report.html`,
    pageName: 'crossPlatform Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - crossPlatform Mobile visual should match Figma', async ({ page }) => {
  const crossPlatform = new CrossPlatformPage(page, 'mobile');
  await crossPlatform.goto();
  await scrollPage(page);
  const buffer = await crossPlatform.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/crossPlatform/crossPlatformMobileFigma.png',
    actualPath: `${diffDir}/crossPlatformMobile-actual.png`,
    diffPath: `${diffDir}/crossPlatformMobile-diff.png`,
    expectedCopyPath: `${diffDir}/crossPlatformMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/crossPlatformMobile-report.html`,
    pageName: 'crossPlatform Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined crossPlatform multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/crossPlatformMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'crossPlatform',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'crossPlatformDesktop-expected.png',
        actualImage: 'crossPlatformDesktop-actual.png',
        diffImage: 'crossPlatformDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'crossPlatformLaptop-expected.png',
        actualImage: 'crossPlatformLaptop-actual.png',
        diffImage: 'crossPlatformLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'crossPlatformTablet-expected.png',
        actualImage: 'crossPlatformTablet-actual.png',
        diffImage: 'crossPlatformTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'crossPlatformMobile-expected.png',
        actualImage: 'crossPlatformMobile-actual.png',
        diffImage: 'crossPlatformMobile-diff.png'
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
