// /tests/visualSolutions/cloudGaming.spec.ts

import { test, expect } from '@playwright/test';
import { CloudGamingPage } from '../../pages/solutions/CloudGamingPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/solutions/cloudGaming/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/cloudGaming/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/solutions/cloudGaming/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/solutions/cloudGaming/mobile';
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

test('A - Cloud Gaming Desktop visual should match Figma', async ({ page }) => {
  const slnCloudGaming = new CloudGamingPage(page, 'desktop');
  await slnCloudGaming.goto();
  await scrollPage(page);
  const buffer = await slnCloudGaming.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnCloudGaming/slnCloudGamingDesktopFigma.png',
    actualPath: `${diffDir}/slnCloudGamingDesktop-actual.png`,
    diffPath: `${diffDir}/slnCloudGamingDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/slnCloudGamingDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnCloudGamingDesktop-report.html`,
    pageName: 'Cloud Gaming Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Cloud Gaming Laptop visual should match Figma', async ({ page }) => {
  const slnCloudGaming = new CloudGamingPage(page, 'laptop');
  await slnCloudGaming.goto();
  await scrollPage(page);
  const buffer = await slnCloudGaming.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnCloudGaming/slnCloudGamingLaptopFigma.png',
    actualPath: `${diffDir}/slnCloudGamingLaptop-actual.png`,
    diffPath: `${diffDir}/slnCloudGamingLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/slnCloudGamingLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnCloudGamingLaptop-report.html`,
    pageName: 'Cloud Gaming Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Cloud Gaming Tablet visual should match Figma', async ({ page }) => {
  const slnCloudGaming = new CloudGamingPage(page, 'tablet');
  await slnCloudGaming.goto();
  await scrollPage(page);
  const buffer = await slnCloudGaming.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnCloudGaming/slnCloudGamingTabletFigma.png',
    actualPath: `${diffDir}/slnCloudGamingTablet-actual.png`,
    diffPath: `${diffDir}/slnCloudGamingTablet-diff.png`,
    expectedCopyPath: `${diffDir}/slnCloudGamingTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnCloudGamingTablet-report.html`,
    pageName: 'Cloud Gaming Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Cloud Gaming Mobile visual should match Figma', async ({ page }) => {
  const slnCloudGaming = new CloudGamingPage(page, 'mobile');
  await slnCloudGaming.goto();
  await scrollPage(page);
  const buffer = await slnCloudGaming.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnCloudGaming/slnCloudGamingMobileFigma.png',
    actualPath: `${diffDir}/slnCloudGamingMobile-actual.png`,
    diffPath: `${diffDir}/slnCloudGamingMobile-diff.png`,
    expectedCopyPath: `${diffDir}/slnCloudGamingMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnCloudGamingMobile-report.html`,
    pageName: 'Cloud Gaming Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined cloud gaming multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/slnCloudGamingMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Cloud Gaming',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'slnCloudGamingDesktop-expected.png',
        actualImage: 'slnCloudGamingDesktop-actual.png',
        diffImage: 'slnCloudGamingDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'slnCloudGamingLaptop-expected.png',
        actualImage: 'slnCloudGamingLaptop-actual.png',
        diffImage: 'slnCloudGamingLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'slnCloudGamingTablet-expected.png',
        actualImage: 'slnCloudGamingTablet-actual.png',
        diffImage: 'slnCloudGamingTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'slnCloudGamingMobile-expected.png',
        actualImage: 'slnCloudGamingMobile-actual.png',
        diffImage: 'slnCloudGamingMobile-diff.png'
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
