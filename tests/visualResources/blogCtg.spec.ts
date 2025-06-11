import { test, expect } from '@playwright/test';
import { BlogCtgPage } from '../../pages/resources/BlogCtgPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/blogCtg/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/blogCtg/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/blogCtg/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/blogCtg/mobile';
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

test('A - blogCtg Desktop visual should match Figma', async ({ page }) => {
  const blogCtg = new BlogCtgPage(page, 'desktop');
  await blogCtg.goto();
  await scrollPage(page);
  const buffer = await blogCtg.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogCtg/blogCtgDesktopFigma.png',
    actualPath: `${diffDir}/blogCtgDesktop-actual.png`,
    diffPath: `${diffDir}/blogCtgDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/blogCtgDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogCtgDesktop-report.html`,
    pageName: 'blogCtg Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - blogCtg Laptop visual should match Figma', async ({ page }) => {
  const blogCtg = new BlogCtgPage(page, 'laptop');
  await blogCtg.goto();
  await scrollPage(page);
  const buffer = await blogCtg.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogCtg/blogCtgLaptopFigma.png',
    actualPath: `${diffDir}/blogCtgLaptop-actual.png`,
    diffPath: `${diffDir}/blogCtgLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/blogCtgLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogCtgLaptop-report.html`,
    pageName: 'blogCtg Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - blogCtg Tablet visual should match Figma', async ({ page }) => {
  const blogCtg = new BlogCtgPage(page, 'tablet');
  await blogCtg.goto();
  await scrollPage(page);
  const buffer = await blogCtg.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogCtg/blogCtgTabletFigma.png',
    actualPath: `${diffDir}/blogCtgTablet-actual.png`,
    diffPath: `${diffDir}/blogCtgTablet-diff.png`,
    expectedCopyPath: `${diffDir}/blogCtgTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogCtgTablet-report.html`,
    pageName: 'blogCtg Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - blogCtg Mobile visual should match Figma', async ({ page }) => {
  const blogCtg = new BlogCtgPage(page, 'mobile');
  await blogCtg.goto();
  await scrollPage(page);
  const buffer = await blogCtg.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogCtg/blogCtgMobileFigma.png',
    actualPath: `${diffDir}/blogCtgMobile-actual.png`,
    diffPath: `${diffDir}/blogCtgMobile-diff.png`,
    expectedCopyPath: `${diffDir}/blogCtgMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogCtgMobile-report.html`,
    pageName: 'blogCtg Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined blogCtg multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/blogCtgMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'blogCtg',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'blogCtgDesktop-expected.png',
        actualImage: 'blogCtgDesktop-actual.png',
        diffImage: 'blogCtgDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'blogCtgLaptop-expected.png',
        actualImage: 'blogCtgLaptop-actual.png',
        diffImage: 'blogCtgLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'blogCtgTablet-expected.png',
        actualImage: 'blogCtgTablet-actual.png',
        diffImage: 'blogCtgTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'blogCtgMobile-expected.png',
        actualImage: 'blogCtgMobile-actual.png',
        diffImage: 'blogCtgMobile-diff.png'
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
