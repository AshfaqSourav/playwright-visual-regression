import { test, expect } from '@playwright/test';
import { NewsroomInnerPage } from '../../pages/resources/NewsroomInnerPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/newsroomInner/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/newsroomInner/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/newsroomInner/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/newsroomInner/mobile';
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

test('A - newsroomInner Desktop visual should match Figma', async ({ page }) => {
  const newsroomInner = new NewsroomInnerPage(page, 'desktop');
  await newsroomInner.goto();
  await scrollPage(page);
  const buffer = await newsroomInner.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomInner/newsroomInnerDesktopFigma.png',
    actualPath: `${diffDir}/newsroomInnerDesktop-actual.png`,
    diffPath: `${diffDir}/newsroomInnerDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomInnerDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomInnerDesktop-report.html`,
    pageName: 'newsroomInner Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - newsroomInner Laptop visual should match Figma', async ({ page }) => {
  const newsroomInner = new NewsroomInnerPage(page, 'laptop');
  await newsroomInner.goto();
  await scrollPage(page);
  const buffer = await newsroomInner.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomInner/newsroomInnerLaptopFigma.png',
    actualPath: `${diffDir}/newsroomInnerLaptop-actual.png`,
    diffPath: `${diffDir}/newsroomInnerLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomInnerLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomInnerLaptop-report.html`,
    pageName: 'newsroomInner Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - newsroomInner Tablet visual should match Figma', async ({ page }) => {
  const newsroomInner = new NewsroomInnerPage(page, 'tablet');
  await newsroomInner.goto();
  await scrollPage(page);
  const buffer = await newsroomInner.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomInner/newsroomInnerTabletFigma.png',
    actualPath: `${diffDir}/newsroomInnerTablet-actual.png`,
    diffPath: `${diffDir}/newsroomInnerTablet-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomInnerTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomInnerTablet-report.html`,
    pageName: 'newsroomInner Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - newsroomInner Mobile visual should match Figma', async ({ page }) => {
  const newsroomInner = new NewsroomInnerPage(page, 'mobile');
  await newsroomInner.goto();
  await scrollPage(page);
  const buffer = await newsroomInner.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomInner/newsroomInnerMobileFigma.png',
    actualPath: `${diffDir}/newsroomInnerMobile-actual.png`,
    diffPath: `${diffDir}/newsroomInnerMobile-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomInnerMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomInnerMobile-report.html`,
    pageName: 'newsroomInner Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined newsroomInner multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/newsroomInnerMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'newsroomInner',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'newsroomInnerDesktop-expected.png',
        actualImage: 'newsroomInnerDesktop-actual.png',
        diffImage: 'newsroomInnerDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'newsroomInnerLaptop-expected.png',
        actualImage: 'newsroomInnerLaptop-actual.png',
        diffImage: 'newsroomInnerLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'newsroomInnerTablet-expected.png',
        actualImage: 'newsroomInnerTablet-actual.png',
        diffImage: 'newsroomInnerTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'newsroomInnerMobile-expected.png',
        actualImage: 'newsroomInnerMobile-actual.png',
        diffImage: 'newsroomInnerMobile-diff.png'
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
