import { test, expect } from '@playwright/test';
import { FaqIndexPage } from '../../pages/staticPages2/FaqIndexPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages2/faqIndex/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages2/faqIndex/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages2/faqIndex/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages2/faqIndex/mobile';
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

test('A - FaqIndex Desktop visual should match Figma', async ({ page }) => {
  const faqIndex = new FaqIndexPage(page, 'desktop');
  await faqIndex.goto();
  await scrollPage(page);
  const buffer = await faqIndex.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqIndex/faqIndexDesktopFigma.png',
    actualPath: `${diffDir}/faqIndexDesktop-actual.png`,
    diffPath: `${diffDir}/faqIndexDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/faqIndexDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqIndexDesktop-report.html`,
    pageName: 'FaqIndex Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - FaqIndex Laptop visual should match Figma', async ({ page }) => {
  const faqIndex = new FaqIndexPage(page, 'laptop');
  await faqIndex.goto();
  await scrollPage(page);
  const buffer = await faqIndex.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqIndex/faqIndexLaptopFigma.png',
    actualPath: `${diffDir}/faqIndexLaptop-actual.png`,
    diffPath: `${diffDir}/faqIndexLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/faqIndexLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqIndexLaptop-report.html`,
    pageName: 'FaqIndex Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - FaqIndex Tablet visual should match Figma', async ({ page }) => {
  const faqIndex = new FaqIndexPage(page, 'tablet');
  await faqIndex.goto();
  await scrollPage(page);
  const buffer = await faqIndex.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqIndex/faqIndexTabletFigma.png',
    actualPath: `${diffDir}/faqIndexTablet-actual.png`,
    diffPath: `${diffDir}/faqIndexTablet-diff.png`,
    expectedCopyPath: `${diffDir}/faqIndexTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqIndexTablet-report.html`,
    pageName: 'FaqIndex Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - FaqIndex Mobile visual should match Figma', async ({ page }) => {
  const faqIndex = new FaqIndexPage(page, 'mobile');
  await faqIndex.goto();
  await scrollPage(page);
  const buffer = await faqIndex.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqIndex/faqIndexMobileFigma.png',
    actualPath: `${diffDir}/faqIndexMobile-actual.png`,
    diffPath: `${diffDir}/faqIndexMobile-diff.png`,
    expectedCopyPath: `${diffDir}/faqIndexMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqIndexMobile-report.html`,
    pageName: 'FaqIndex Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined faqIndex multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/faqIndexMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'FaqIndex',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'faqIndexDesktop-expected.png',
        actualImage: 'faqIndexDesktop-actual.png',
        diffImage: 'faqIndexDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'faqIndexLaptop-expected.png',
        actualImage: 'faqIndexLaptop-actual.png',
        diffImage: 'faqIndexLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'faqIndexTablet-expected.png',
        actualImage: 'faqIndexTablet-actual.png',
        diffImage: 'faqIndexTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'faqIndexMobile-expected.png',
        actualImage: 'faqIndexMobile-actual.png',
        diffImage: 'faqIndexMobile-diff.png'
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
