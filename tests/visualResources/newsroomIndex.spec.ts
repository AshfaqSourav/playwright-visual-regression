import { test, expect } from '@playwright/test';
import { NewsroomInnerPage } from '../../pages/resources/NewsroomInnerPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/newsroomIndex/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/newsroomIndex/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/newsroomIndex/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/newsroomIndex/mobile';
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

test('A - newsroomIndex Desktop visual should match Figma', async ({ page }) => {
  const newsroomIndex = new NewsroomInnerPage(page, 'desktop');
  await newsroomIndex.goto();
  await scrollPage(page);
  const buffer = await newsroomIndex.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomIndex/newsroomIndexDesktopFigma.png',
    actualPath: `${diffDir}/newsroomIndexDesktop-actual.png`,
    diffPath: `${diffDir}/newsroomIndexDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomIndexDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomIndexDesktop-report.html`,
    pageName: 'newsroomIndex Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - newsroomIndex Laptop visual should match Figma', async ({ page }) => {
  const newsroomIndex = new NewsroomInnerPage(page, 'laptop');
  await newsroomIndex.goto();
  await scrollPage(page);
  const buffer = await newsroomIndex.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomIndex/newsroomIndexLaptopFigma.png',
    actualPath: `${diffDir}/newsroomIndexLaptop-actual.png`,
    diffPath: `${diffDir}/newsroomIndexLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomIndexLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomIndexLaptop-report.html`,
    pageName: 'newsroomIndex Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - newsroomIndex Tablet visual should match Figma', async ({ page }) => {
  const newsroomIndex = new NewsroomInnerPage(page, 'tablet');
  await newsroomIndex.goto();
  await scrollPage(page);
  const buffer = await newsroomIndex.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomIndex/newsroomIndexTabletFigma.png',
    actualPath: `${diffDir}/newsroomIndexTablet-actual.png`,
    diffPath: `${diffDir}/newsroomIndexTablet-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomIndexTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomIndexTablet-report.html`,
    pageName: 'newsroomIndex Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - newsroomIndex Mobile visual should match Figma', async ({ page }) => {
  const newsroomIndex = new NewsroomInnerPage(page, 'mobile');
  await newsroomIndex.goto();
  await scrollPage(page);
  const buffer = await newsroomIndex.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/newsroomIndex/newsroomIndexMobileFigma.png',
    actualPath: `${diffDir}/newsroomIndexMobile-actual.png`,
    diffPath: `${diffDir}/newsroomIndexMobile-diff.png`,
    expectedCopyPath: `${diffDir}/newsroomIndexMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/newsroomIndexMobile-report.html`,
    pageName: 'newsroomIndex Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined newsroomIndex multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/newsroomIndexMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'newsroomIndex',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'newsroomIndexDesktop-expected.png',
        actualImage: 'newsroomIndexDesktop-actual.png',
        diffImage: 'newsroomIndexDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'newsroomIndexLaptop-expected.png',
        actualImage: 'newsroomIndexLaptop-actual.png',
        diffImage: 'newsroomIndexLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'newsroomIndexTablet-expected.png',
        actualImage: 'newsroomIndexTablet-actual.png',
        diffImage: 'newsroomIndexTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'newsroomIndexMobile-expected.png',
        actualImage: 'newsroomIndexMobile-actual.png',
        diffImage: 'newsroomIndexMobile-diff.png'
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
