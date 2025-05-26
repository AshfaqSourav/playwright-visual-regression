// /tests/visualSolutions/slnZk.spec.ts

import { test, expect } from '@playwright/test';
import { ZkPage } from '../../pages/solutions/ZkPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/solutions/zk/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/zk/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/solutions/zk/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/solutions/zk/mobile';
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

test('A - Zk Desktop visual should match Figma', async ({ page }) => {
  const slnZk = new ZkPage(page, 'desktop');
  await slnZk.goto();
  await scrollPage(page);
  const buffer = await slnZk.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnZk/slnZkDesktopFigma.png',
    actualPath: `${diffDir}/slnZkDesktop-actual.png`,
    diffPath: `${diffDir}/slnZkDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/slnZkDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnZkDesktop-report.html`,
    pageName: 'Zk Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Zk Laptop visual should match Figma', async ({ page }) => {
  const slnZk = new ZkPage(page, 'laptop');
  await slnZk.goto();
  await scrollPage(page);
  const buffer = await slnZk.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnZk/slnZkLaptopFigma.png',
    actualPath: `${diffDir}/slnZkLaptop-actual.png`,
    diffPath: `${diffDir}/slnZkLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/slnZkLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnZkLaptop-report.html`,
    pageName: 'Zk Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Zk Tablet visual should match Figma', async ({ page }) => {
  const slnZk = new ZkPage(page, 'tablet');
  await slnZk.goto();
  await scrollPage(page);
  const buffer = await slnZk.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnZk/slnZkTabletFigma.png',
    actualPath: `${diffDir}/slnZkTablet-actual.png`,
    diffPath: `${diffDir}/slnZkTablet-diff.png`,
    expectedCopyPath: `${diffDir}/slnZkTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnZkTablet-report.html`,
    pageName: 'Zk Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Zk Mobile visual should match Figma', async ({ page }) => {
  const slnZk = new ZkPage(page, 'mobile');
  await slnZk.goto();
  await scrollPage(page);
  const buffer = await slnZk.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnZk/slnZkMobileFigma.png',
    actualPath: `${diffDir}/slnZkMobile-actual.png`,
    diffPath: `${diffDir}/slnZkMobile-diff.png`,
    expectedCopyPath: `${diffDir}/slnZkMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnZkMobile-report.html`,
    pageName: 'Zk Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined Zk multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/slnZkMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Zk',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'slnZkDesktop-expected.png',
        actualImage: 'slnZkDesktop-actual.png',
        diffImage: 'slnZkDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'slnZkLaptop-expected.png',
        actualImage: 'slnZkLaptop-actual.png',
        diffImage: 'slnZkLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'slnZkTablet-expected.png',
        actualImage: 'slnZkTablet-actual.png',
        diffImage: 'slnZkTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'slnZkMobile-expected.png',
        actualImage: 'slnZkMobile-actual.png',
        diffImage: 'slnZkMobile-diff.png'
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
