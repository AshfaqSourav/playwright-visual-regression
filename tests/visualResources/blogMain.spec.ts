import { test, expect } from '@playwright/test';
import { BlogMainPage } from '../../pages/resources/BlogMainPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/resources/blogMain/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/resources/blogMain/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/resources/blogMain/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/resources/blogMain/mobile';
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

test('A - blogMain Desktop visual should match Figma', async ({ page }) => {
  const blogMain = new BlogMainPage(page, 'desktop');
  await blogMain.goto();
  await scrollPage(page);
  const buffer = await blogMain.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogMain/blogMainDesktopFigma.png',
    actualPath: `${diffDir}/blogMainDesktop-actual.png`,
    diffPath: `${diffDir}/blogMainDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/blogMainDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogMainDesktop-report.html`,
    pageName: 'blogMain Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - blogMain Laptop visual should match Figma', async ({ page }) => {
  const blogMain = new BlogMainPage(page, 'laptop');
  await blogMain.goto();
  await scrollPage(page);
  const buffer = await blogMain.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogMain/blogMainLaptopFigma.png',
    actualPath: `${diffDir}/blogMainLaptop-actual.png`,
    diffPath: `${diffDir}/blogMainLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/blogMainLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogMainLaptop-report.html`,
    pageName: 'blogMain Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - blogMain Tablet visual should match Figma', async ({ page }) => {
  const blogMain = new BlogMainPage(page, 'tablet');
  await blogMain.goto();
  await scrollPage(page);
  const buffer = await blogMain.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogMain/blogMainTabletFigma.png',
    actualPath: `${diffDir}/blogMainTablet-actual.png`,
    diffPath: `${diffDir}/blogMainTablet-diff.png`,
    expectedCopyPath: `${diffDir}/blogMainTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogMainTablet-report.html`,
    pageName: 'blogMain Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - blogMain Mobile visual should match Figma', async ({ page }) => {
  const blogMain = new BlogMainPage(page, 'mobile');
  await blogMain.goto();
  await scrollPage(page);
  const buffer = await blogMain.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/blogMain/blogMainMobileFigma.png',
    actualPath: `${diffDir}/blogMainMobile-actual.png`,
    diffPath: `${diffDir}/blogMainMobile-diff.png`,
    expectedCopyPath: `${diffDir}/blogMainMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/blogMainMobile-report.html`,
    pageName: 'blogMain Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined blogMain multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/blogMainMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'blogMain',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'blogMainDesktop-expected.png',
        actualImage: 'blogMainDesktop-actual.png',
        diffImage: 'blogMainDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'blogMainLaptop-expected.png',
        actualImage: 'blogMainLaptop-actual.png',
        diffImage: 'blogMainLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'blogMainTablet-expected.png',
        actualImage: 'blogMainTablet-actual.png',
        diffImage: 'blogMainTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'blogMainMobile-expected.png',
        actualImage: 'blogMainMobile-actual.png',
        diffImage: 'blogMainMobile-diff.png'
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
