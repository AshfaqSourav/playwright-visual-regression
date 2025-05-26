// /tests/visualWebShop/wsSocialPackages.spec.ts

import { test, expect } from '@playwright/test';
import { WSSocialPackagesPage } from '../../pages/webShop/WSSocialPackagesPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/socialPackages/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/socialPackages/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/socialPackages/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/socialPackages/mobile';
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

test('A - WS SocialPackages Desktop visual should match Figma', async ({ page }) => {
  const wsSocialPackages = new WSSocialPackagesPage(page, 'desktop');
  await wsSocialPackages.goto();
  await scrollPage(page);
  const buffer = await wsSocialPackages.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsSocialPackages/wsSocialPackagesDesktopFigma.png',
    actualPath: `${diffDir}/wsSocialPackagesDesktop-actual.png`,
    diffPath: `${diffDir}/wsSocialPackagesDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsSocialPackagesDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsSocialPackagesDesktop-report.html`,
    pageName: 'WS SocialPackages Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS SocialPackages Laptop visual should match Figma', async ({ page }) => {
  const wsSocialPackages = new WSSocialPackagesPage(page, 'laptop');
  await wsSocialPackages.goto();
  await scrollPage(page);
  const buffer = await wsSocialPackages.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsSocialPackages/wsSocialPackagesLaptopFigma.png',
    actualPath: `${diffDir}/wsSocialPackagesLaptop-actual.png`,
    diffPath: `${diffDir}/wsSocialPackagesLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsSocialPackagesLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsSocialPackagesLaptop-report.html`,
    pageName: 'WS SocialPackages Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS SocialPackages Tablet visual should match Figma', async ({ page }) => {
  const wsSocialPackages = new WSSocialPackagesPage(page, 'tablet');
  await wsSocialPackages.goto();
  await scrollPage(page);
  const buffer = await wsSocialPackages.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsSocialPackages/wsSocialPackagesTabletFigma.png',
    actualPath: `${diffDir}/wsSocialPackagesTablet-actual.png`,
    diffPath: `${diffDir}/wsSocialPackagesTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsSocialPackagesTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsSocialPackagesTablet-report.html`,
    pageName: 'WS SocialPackages Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS SocialPackages Mobile visual should match Figma', async ({ page }) => {
  const wsSocialPackages = new WSSocialPackagesPage(page, 'mobile');
  await wsSocialPackages.goto();
  await scrollPage(page);
  const buffer = await wsSocialPackages.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsSocialPackages/wsSocialPackagesMobileFigma.png',
    actualPath: `${diffDir}/wsSocialPackagesMobile-actual.png`,
    diffPath: `${diffDir}/wsSocialPackagesMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsSocialPackagesMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsSocialPackagesMobile-report.html`,
    pageName: 'WS SocialPackages Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined WS SocialPackages multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/wsSocialPackagesMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS SocialPackages',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsSocialPackagesDesktop-expected.png',
        actualImage: 'wsSocialPackagesDesktop-actual.png',
        diffImage: 'wsSocialPackagesDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsSocialPackagesLaptop-expected.png',
        actualImage: 'wsSocialPackagesLaptop-actual.png',
        diffImage: 'wsSocialPackagesLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsSocialPackagesTablet-expected.png',
        actualImage: 'wsSocialPackagesTablet-actual.png',
        diffImage: 'wsSocialPackagesTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsSocialPackagesMobile-expected.png',
        actualImage: 'wsSocialPackagesMobile-actual.png',
        diffImage: 'wsSocialPackagesMobile-diff.png'
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
