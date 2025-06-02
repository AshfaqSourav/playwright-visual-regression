import { test, expect } from '@playwright/test';
import { FaqInnerPage } from '../../pages/staticPages2/FaqInnerPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages2/faqInner/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages2/faqInner/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages2/faqInner/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages2/faqInner/mobile';
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

test('A - FaqInner Desktop visual should match Figma', async ({ page }) => {
  const faqInner = new FaqInnerPage(page, 'desktop');
  await faqInner.goto();
  await scrollPage(page);
  const buffer = await faqInner.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqInner/faqInnerDesktopFigma.png',
    actualPath: `${diffDir}/faqInnerDesktop-actual.png`,
    diffPath: `${diffDir}/faqInnerDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/faqInnerDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqInnerDesktop-report.html`,
    pageName: 'FaqInner Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - FaqInner Laptop visual should match Figma', async ({ page }) => {
  const faqInner = new FaqInnerPage(page, 'laptop');
  await faqInner.goto();
  await scrollPage(page);
  const buffer = await faqInner.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqInner/faqInnerLaptopFigma.png',
    actualPath: `${diffDir}/faqInnerLaptop-actual.png`,
    diffPath: `${diffDir}/faqInnerLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/faqInnerLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqInnerLaptop-report.html`,
    pageName: 'FaqInner Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - FaqInner Tablet visual should match Figma', async ({ page }) => {
  const faqInner = new FaqInnerPage(page, 'tablet');
  await faqInner.goto();
  await scrollPage(page);
  const buffer = await faqInner.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqInner/faqInnerTabletFigma.png',
    actualPath: `${diffDir}/faqInnerTablet-actual.png`,
    diffPath: `${diffDir}/faqInnerTablet-diff.png`,
    expectedCopyPath: `${diffDir}/faqInnerTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqInnerTablet-report.html`,
    pageName: 'FaqInner Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - FaqInner Mobile visual should match Figma', async ({ page }) => {
  const faqInner = new FaqInnerPage(page, 'mobile');
  await faqInner.goto();
  await scrollPage(page);
  const buffer = await faqInner.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/faqInner/faqInnerMobileFigma.png',
    actualPath: `${diffDir}/faqInnerMobile-actual.png`,
    diffPath: `${diffDir}/faqInnerMobile-diff.png`,
    expectedCopyPath: `${diffDir}/faqInnerMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/faqInnerMobile-report.html`,
    pageName: 'FaqInner Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined faqInner multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/faqInnerMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'FaqInner',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'faqInnerDesktop-expected.png',
        actualImage: 'faqInnerDesktop-actual.png',
        diffImage: 'faqInnerDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'faqInnerLaptop-expected.png',
        actualImage: 'faqInnerLaptop-actual.png',
        diffImage: 'faqInnerLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'faqInnerTablet-expected.png',
        actualImage: 'faqInnerTablet-actual.png',
        diffImage: 'faqInnerTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'faqInnerMobile-expected.png',
        actualImage: 'faqInnerMobile-actual.png',
        diffImage: 'faqInnerMobile-diff.png'
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
