import { test, expect } from '@playwright/test';
import { LegalInnerPage } from '../../pages/resources/LegalInnerPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/legalInner/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/legalInner/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/legalInner/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/legalInner/mobile';
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

test('A - LegalInner Desktop visual should match Figma', async ({ page }) => {
  const legalInner = new LegalInnerPage(page, 'desktop');
  await legalInner.goto();
  await scrollPage(page);
  const buffer = await legalInner.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalInner/legalInnerDesktopFigma.png',
    actualPath: `${diffDir}/legalInnerDesktop-actual.png`,
    diffPath: `${diffDir}/legalInnerDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/legalInnerDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalInnerDesktop-report.html`,
    pageName: 'LegalInner Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - LegalInner Laptop visual should match Figma', async ({ page }) => {
  const legalInner = new LegalInnerPage(page, 'laptop');
  await legalInner.goto();
  await scrollPage(page);
  const buffer = await legalInner.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalInner/legalInnerLaptopFigma.png',
    actualPath: `${diffDir}/legalInnerLaptop-actual.png`,
    diffPath: `${diffDir}/legalInnerLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/legalInnerLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalInnerLaptop-report.html`,
    pageName: 'LegalInner Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - LegalInner Tablet visual should match Figma', async ({ page }) => {
  const legalInner = new LegalInnerPage(page, 'tablet');
  await legalInner.goto();
  await scrollPage(page);
  const buffer = await legalInner.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalInner/legalInnerTabletFigma.png',
    actualPath: `${diffDir}/legalInnerTablet-actual.png`,
    diffPath: `${diffDir}/legalInnerTablet-diff.png`,
    expectedCopyPath: `${diffDir}/legalInnerTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalInnerTablet-report.html`,
    pageName: 'LegalInner Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - LegalInner Mobile visual should match Figma', async ({ page }) => {
  const legalInner = new LegalInnerPage(page, 'mobile');
  await legalInner.goto();
  await scrollPage(page);
  const buffer = await legalInner.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/legalInner/legalInnerMobileFigma.png',
    actualPath: `${diffDir}/legalInnerMobile-actual.png`,
    diffPath: `${diffDir}/legalInnerMobile-diff.png`,
    expectedCopyPath: `${diffDir}/legalInnerMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/legalInnerMobile-report.html`,
    pageName: 'LegalInner Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined legalInner multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/legalInnerMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'LegalInner',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'legalInnerDesktop-expected.png',
        actualImage: 'legalInnerDesktop-actual.png',
        diffImage: 'legalInnerDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'legalInnerLaptop-expected.png',
        actualImage: 'legalInnerLaptop-actual.png',
        diffImage: 'legalInnerLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'legalInnerTablet-expected.png',
        actualImage: 'legalInnerTablet-actual.png',
        diffImage: 'legalInnerTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'legalInnerMobile-expected.png',
        actualImage: 'legalInnerMobile-actual.png',
        diffImage: 'legalInnerMobile-diff.png'
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
