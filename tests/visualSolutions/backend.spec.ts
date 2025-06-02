import { test, expect } from '@playwright/test';
import { BackendPage } from '../../pages/solutions/BackendPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/solutions/backend/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/backend/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/solutions/backend/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/solutions/backend/mobile';
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

test('A - Backend Desktop visual should match Figma', async ({ page }) => {
  const slnBackend = new BackendPage(page, 'desktop');
  await slnBackend.goto();
  await scrollPage(page);
  const buffer = await slnBackend.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnBackend/slnBackendDesktopFigma.png',
    actualPath: `${diffDir}/slnBackendDesktop-actual.png`,
    diffPath: `${diffDir}/slnBackendDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/slnBackendDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnBackendDesktop-report.html`,
    pageName: 'Backend Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Backend Laptop visual should match Figma', async ({ page }) => {
  const slnBackend = new BackendPage(page, 'laptop');
  await slnBackend.goto();
  await scrollPage(page);
  const buffer = await slnBackend.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnBackend/slnBackendLaptopFigma.png',
    actualPath: `${diffDir}/slnBackendLaptop-actual.png`,
    diffPath: `${diffDir}/slnBackendLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/slnBackendLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnBackendLaptop-report.html`,
    pageName: 'Backend Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Backend Tablet visual should match Figma', async ({ page }) => {
  const slnBackend = new BackendPage(page, 'tablet');
  await slnBackend.goto();
  await scrollPage(page);
  const buffer = await slnBackend.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnBackend/slnBackendTabletFigma.png',
    actualPath: `${diffDir}/slnBackendTablet-actual.png`,
    diffPath: `${diffDir}/slnBackendTablet-diff.png`,
    expectedCopyPath: `${diffDir}/slnBackendTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnBackendTablet-report.html`,
    pageName: 'Backend Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Backend Mobile visual should match Figma', async ({ page }) => {
  const slnBackend = new BackendPage(page, 'mobile');
  await slnBackend.goto();
  await scrollPage(page);
  const buffer = await slnBackend.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnBackend/slnBackendMobileFigma.png',
    actualPath: `${diffDir}/slnBackendMobile-actual.png`,
    diffPath: `${diffDir}/slnBackendMobile-diff.png`,
    expectedCopyPath: `${diffDir}/slnBackendMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnBackendMobile-report.html`,
    pageName: 'Backend Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined backend multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/slnBackendMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Backend',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'slnBackendDesktop-expected.png',
        actualImage: 'slnBackendDesktop-actual.png',
        diffImage: 'slnBackendDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'slnBackendLaptop-expected.png',
        actualImage: 'slnBackendLaptop-actual.png',
        diffImage: 'slnBackendLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'slnBackendTablet-expected.png',
        actualImage: 'slnBackendTablet-actual.png',
        diffImage: 'slnBackendTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'slnBackendMobile-expected.png',
        actualImage: 'slnBackendMobile-actual.png',
        diffImage: 'slnBackendMobile-diff.png'
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
