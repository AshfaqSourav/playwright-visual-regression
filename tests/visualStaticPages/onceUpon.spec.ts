import { test, expect } from '@playwright/test';
import { OnceUponPage } from '../../pages/staticPages/OnceUponPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/onceUpon/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/onceUpon/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/onceUpon/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/onceUpon/mobile';
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

test('A - Once Upon Desktop visual should match Figma', async ({ page }) => {
  const onceUpon = new OnceUponPage(page, 'desktop');
  await onceUpon.goto();
  await scrollPage(page);
  const buffer = await onceUpon.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/onceUpon/onceUponDesktopFigma.png',
    actualPath: `${diffDir}/onceUponDesktop-actual.png`,
    diffPath: `${diffDir}/onceUponDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/onceUponDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/onceUponDesktop-report.html`,
    pageName: 'Once Upon Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Once Upon Laptop visual should match Figma', async ({ page }) => {
  const onceUpon = new OnceUponPage(page, 'laptop');
  await onceUpon.goto();
  await scrollPage(page);
  const buffer = await onceUpon.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/onceUpon/onceUponLaptopFigma.png',
    actualPath: `${diffDir}/onceUponLaptop-actual.png`,
    diffPath: `${diffDir}/onceUponLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/onceUponLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/onceUponLaptop-report.html`,
    pageName: 'Once Upon Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Once Upon Tablet visual should match Figma', async ({ page }) => {
  const onceUpon = new OnceUponPage(page, 'tablet');
  await onceUpon.goto();
  await scrollPage(page);
  const buffer = await onceUpon.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/onceUpon/onceUponTabletFigma.png',
    actualPath: `${diffDir}/onceUponTablet-actual.png`,
    diffPath: `${diffDir}/onceUponTablet-diff.png`,
    expectedCopyPath: `${diffDir}/onceUponTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/onceUponTablet-report.html`,
    pageName: 'Once Upon Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Once Upon Mobile visual should match Figma', async ({ page }) => {
  const onceUpon = new OnceUponPage(page, 'mobile');
  await onceUpon.goto();
  await scrollPage(page);
  const buffer = await onceUpon.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/onceUpon/onceUponMobileFigma.png',
    actualPath: `${diffDir}/onceUponMobile-actual.png`,
    diffPath: `${diffDir}/onceUponMobile-diff.png`,
    expectedCopyPath: `${diffDir}/onceUponMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/onceUponMobile-report.html`,
    pageName: 'Once Upon Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined onceUpon multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/onceUponMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Once Upon',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'onceUponDesktop-expected.png',
        actualImage: 'onceUponDesktop-actual.png',
        diffImage: 'onceUponDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'onceUponLaptop-expected.png',
        actualImage: 'onceUponLaptop-actual.png',
        diffImage: 'onceUponLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'onceUponTablet-expected.png',
        actualImage: 'onceUponTablet-actual.png',
        diffImage: 'onceUponTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'onceUponMobile-expected.png',
        actualImage: 'onceUponMobile-actual.png',
        diffImage: 'onceUponMobile-diff.png'
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
