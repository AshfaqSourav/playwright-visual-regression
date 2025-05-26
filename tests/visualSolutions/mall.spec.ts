// /tests/visualSolutions/mall.spec.ts

import { test, expect } from '@playwright/test';
import { MallPage } from '../../pages/solutions/MallPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/solutions/mall/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/mall/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/solutions/mall/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/solutions/mall/mobile';
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

test('A - Mall Desktop visual should match Figma', async ({ page }) => {
  const slnMall = new MallPage(page, 'desktop');
  await slnMall.goto();
  await scrollPage(page);
  const buffer = await slnMall.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnMall/slnMallDesktopFigma.png',
    actualPath: `${diffDir}/slnMallDesktop-actual.png`,
    diffPath: `${diffDir}/slnMallDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/slnMallDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnMallDesktop-report.html`,
    pageName: 'Mall Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Mall Laptop visual should match Figma', async ({ page }) => {
  const slnMall = new MallPage(page, 'laptop');
  await slnMall.goto();
  await scrollPage(page);
  const buffer = await slnMall.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnMall/slnMallLaptopFigma.png',
    actualPath: `${diffDir}/slnMallLaptop-actual.png`,
    diffPath: `${diffDir}/slnMallLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/slnMallLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnMallLaptop-report.html`,
    pageName: 'Mall Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Mall Tablet visual should match Figma', async ({ page }) => {
  const slnMall = new MallPage(page, 'tablet');
  await slnMall.goto();
  await scrollPage(page);
  const buffer = await slnMall.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnMall/slnMallTabletFigma.png',
    actualPath: `${diffDir}/slnMallTablet-actual.png`,
    diffPath: `${diffDir}/slnMallTablet-diff.png`,
    expectedCopyPath: `${diffDir}/slnMallTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnMallTablet-report.html`,
    pageName: 'Mall Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Mall Mobile visual should match Figma', async ({ page }) => {
  const slnMall = new MallPage(page, 'mobile');
  await slnMall.goto();
  await scrollPage(page);
  const buffer = await slnMall.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnMall/slnMallMobileFigma.png',
    actualPath: `${diffDir}/slnMallMobile-actual.png`,
    diffPath: `${diffDir}/slnMallMobile-diff.png`,
    expectedCopyPath: `${diffDir}/slnMallMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnMallMobile-report.html`,
    pageName: 'Mall Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined mall multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/slnMallMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Mall',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'slnMallDesktop-expected.png',
        actualImage: 'slnMallDesktop-actual.png',
        diffImage: 'slnMallDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'slnMallLaptop-expected.png',
        actualImage: 'slnMallLaptop-actual.png',
        diffImage: 'slnMallLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'slnMallTablet-expected.png',
        actualImage: 'slnMallTablet-actual.png',
        diffImage: 'slnMallTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'slnMallMobile-expected.png',
        actualImage: 'slnMallMobile-actual.png',
        diffImage: 'slnMallMobile-diff.png'
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
