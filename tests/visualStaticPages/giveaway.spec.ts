import { test, expect } from '@playwright/test';
import { GiveawayPage } from '../../pages/staticPages/GiveawayPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/giveaway/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/giveaway/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/giveaway/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/giveaway/mobile';
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

test('A - Giveaway Desktop visual should match Figma', async ({ page }) => {
  const giveaway = new GiveawayPage(page, 'desktop');
  await giveaway.goto();
  await scrollPage(page);
  const buffer = await giveaway.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/giveaway/giveawayDesktopFigma.png',
    actualPath: `${diffDir}/giveawayDesktop-actual.png`,
    diffPath: `${diffDir}/giveawayDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/giveawayDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/giveawayDesktop-report.html`,
    pageName: 'Giveaway Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Giveaway Laptop visual should match Figma', async ({ page }) => {
  const giveaway = new GiveawayPage(page, 'laptop');
  await giveaway.goto();
  await scrollPage(page);
  const buffer = await giveaway.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/giveaway/giveawayLaptopFigma.png',
    actualPath: `${diffDir}/giveawayLaptop-actual.png`,
    diffPath: `${diffDir}/giveawayLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/giveawayLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/giveawayLaptop-report.html`,
    pageName: 'Giveaway Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Giveaway Tablet visual should match Figma', async ({ page }) => {
  const giveaway = new GiveawayPage(page, 'tablet');
  await giveaway.goto();
  await scrollPage(page);
  const buffer = await giveaway.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/giveaway/giveawayTabletFigma.png',
    actualPath: `${diffDir}/giveawayTablet-actual.png`,
    diffPath: `${diffDir}/giveawayTablet-diff.png`,
    expectedCopyPath: `${diffDir}/giveawayTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/giveawayTablet-report.html`,
    pageName: 'Giveaway Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Giveaway Mobile visual should match Figma', async ({ page }) => {
  const giveaway = new GiveawayPage(page, 'mobile');
  await giveaway.goto();
  await scrollPage(page);
  const buffer = await giveaway.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/giveaway/giveawayMobileFigma.png',
    actualPath: `${diffDir}/giveawayMobile-actual.png`,
    diffPath: `${diffDir}/giveawayMobile-diff.png`,
    expectedCopyPath: `${diffDir}/giveawayMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/giveawayMobile-report.html`,
    pageName: 'Giveaway Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined giveaway multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/giveawayMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Giveaway',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'giveawayDesktop-expected.png',
        actualImage: 'giveawayDesktop-actual.png',
        diffImage: 'giveawayDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'giveawayLaptop-expected.png',
        actualImage: 'giveawayLaptop-actual.png',
        diffImage: 'giveawayLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'giveawayTablet-expected.png',
        actualImage: 'giveawayTablet-actual.png',
        diffImage: 'giveawayTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'giveawayMobile-expected.png',
        actualImage: 'giveawayMobile-actual.png',
        diffImage: 'giveawayMobile-diff.png'
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
