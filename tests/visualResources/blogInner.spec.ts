import { test, expect } from '@playwright/test';
import { BlogInnerPage } from '../../pages/resources/BlogInnerPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/blogInner/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/blogInner/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/blogInner/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/blogInner/mobile';
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

test('A - blogInner Desktop visual should match Figma', async ({ page }) => {
  const blogInner = new BlogInnerPage(page, 'desktop');
  await blogInner.goto();
  await scrollPage(page);
  const buffer = await blogInner.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogInner/blogInnerDesktopFigma.png',
    actualPath: `${diffDir}/blogInnerDesktop-actual.png`,
    diffPath: `${diffDir}/blogInnerDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/blogInnerDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogInnerDesktop-report.html`,
    pageName: 'blogInner Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - blogInner Laptop visual should match Figma', async ({ page }) => {
  const blogInner = new BlogInnerPage(page, 'laptop');
  await blogInner.goto();
  await scrollPage(page);
  const buffer = await blogInner.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogInner/blogInnerLaptopFigma.png',
    actualPath: `${diffDir}/blogInnerLaptop-actual.png`,
    diffPath: `${diffDir}/blogInnerLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/blogInnerLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogInnerLaptop-report.html`,
    pageName: 'blogInner Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - blogInner Tablet visual should match Figma', async ({ page }) => {
  const blogInner = new BlogInnerPage(page, 'tablet');
  await blogInner.goto();
  await scrollPage(page);
  const buffer = await blogInner.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogInner/blogInnerTabletFigma.png',
    actualPath: `${diffDir}/blogInnerTablet-actual.png`,
    diffPath: `${diffDir}/blogInnerTablet-diff.png`,
    expectedCopyPath: `${diffDir}/blogInnerTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogInnerTablet-report.html`,
    pageName: 'blogInner Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - blogInner Mobile visual should match Figma', async ({ page }) => {
  const blogInner = new BlogInnerPage(page, 'mobile');
  await blogInner.goto();
  await scrollPage(page);
  const buffer = await blogInner.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogInner/blogInnerMobileFigma.png',
    actualPath: `${diffDir}/blogInnerMobile-actual.png`,
    diffPath: `${diffDir}/blogInnerMobile-diff.png`,
    expectedCopyPath: `${diffDir}/blogInnerMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogInnerMobile-report.html`,
    pageName: 'blogInner Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined blogInner multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/blogInnerMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'blogInner',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'blogInnerDesktop-expected.png',
        actualImage: 'blogInnerDesktop-actual.png',
        diffImage: 'blogInnerDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'blogInnerLaptop-expected.png',
        actualImage: 'blogInnerLaptop-actual.png',
        diffImage: 'blogInnerLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'blogInnerTablet-expected.png',
        actualImage: 'blogInnerTablet-actual.png',
        diffImage: 'blogInnerTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'blogInnerMobile-expected.png',
        actualImage: 'blogInnerMobile-actual.png',
        diffImage: 'blogInnerMobile-diff.png'
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
