// /tests/visualSolutions/xpn.spec.ts

import { test, expect } from '@playwright/test';
import { XpnPage } from '../../pages/solutions/XpnPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/solutions/xpn/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/xpn/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/solutions/xpn/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/solutions/xpn/mobile';
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

test('A - Xpn Desktop visual should match Figma', async ({ page }) => {
  const slnXpn = new XpnPage(page, 'desktop');
  await slnXpn.goto();
  await scrollPage(page);
  const buffer = await slnXpn.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXpn/slnXpnDesktopFigma.png',
    actualPath: `${diffDir}/slnXpnDesktop-actual.png`,
    diffPath: `${diffDir}/slnXpnDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/slnXpnDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXpnDesktop-report.html`,
    pageName: 'Xpn Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Xpn Laptop visual should match Figma', async ({ page }) => {
  const slnXpn = new XpnPage(page, 'laptop');
  await slnXpn.goto();
  await scrollPage(page);
  const buffer = await slnXpn.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXpn/slnXpnLaptopFigma.png',
    actualPath: `${diffDir}/slnXpnLaptop-actual.png`,
    diffPath: `${diffDir}/slnXpnLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/slnXpnLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXpnLaptop-report.html`,
    pageName: 'Xpn Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Xpn Tablet visual should match Figma', async ({ page }) => {
  const slnXpn = new XpnPage(page, 'tablet');
  await slnXpn.goto();
  await scrollPage(page);
  const buffer = await slnXpn.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXpn/slnXpnTabletFigma.png',
    actualPath: `${diffDir}/slnXpnTablet-actual.png`,
    diffPath: `${diffDir}/slnXpnTablet-diff.png`,
    expectedCopyPath: `${diffDir}/slnXpnTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXpnTablet-report.html`,
    pageName: 'Xpn Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Xpn Mobile visual should match Figma', async ({ page }) => {
  const slnXpn = new XpnPage(page, 'mobile');
  await slnXpn.goto();
  await scrollPage(page);
  const buffer = await slnXpn.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXpn/slnXpnMobileFigma.png',
    actualPath: `${diffDir}/slnXpnMobile-actual.png`,
    diffPath: `${diffDir}/slnXpnMobile-diff.png`,
    expectedCopyPath: `${diffDir}/slnXpnMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXpnMobile-report.html`,
    pageName: 'Xpn Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined xpn multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/slnXpnMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Xpn',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'slnXpnDesktop-expected.png',
        actualImage: 'slnXpnDesktop-actual.png',
        diffImage: 'slnXpnDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'slnXpnLaptop-expected.png',
        actualImage: 'slnXpnLaptop-actual.png',
        diffImage: 'slnXpnLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'slnXpnTablet-expected.png',
        actualImage: 'slnXpnTablet-actual.png',
        diffImage: 'slnXpnTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'slnXpnMobile-expected.png',
        actualImage: 'slnXpnMobile-actual.png',
        diffImage: 'slnXpnMobile-diff.png'
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
