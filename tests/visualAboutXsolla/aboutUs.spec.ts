import { test, expect } from '@playwright/test';
import { AboutUsPage } from '../../pages/aboutXsolla/AboutUsPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutXsolla/aboutUs/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutXsolla/aboutUs/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutXsolla/aboutUs/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutXsolla/aboutUs/mobile';
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

test('A - About Us Desktop visual should match Figma', async ({ page }) => {
  const aboutUs = new AboutUsPage(page, 'desktop');
  await aboutUs.goto();
  await scrollPage(page);
  const buffer = await aboutUs.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsDesktopFigma.png',
    actualPath: `${diffDir}/aboutUsDesktop-actual.png`,
    diffPath: `${diffDir}/aboutUsDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsDesktop-report.html`,
    pageName: 'About Us Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - About Us Laptop visual should match Figma', async ({ page }) => {
  const aboutUs = new AboutUsPage(page, 'laptop');
  await aboutUs.goto();
  await scrollPage(page);
  const buffer = await aboutUs.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsLaptopFigma.png',
    actualPath: `${diffDir}/aboutUsLaptop-actual.png`,
    diffPath: `${diffDir}/aboutUsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsLaptop-report.html`,
    pageName: 'About Us Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - About Us Tablet visual should match Figma', async ({ page }) => {
  const aboutUs = new AboutUsPage(page, 'tablet');
  await aboutUs.goto();
  await scrollPage(page);
  const buffer = await aboutUs.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsTabletFigma.png',
    actualPath: `${diffDir}/aboutUsTablet-actual.png`,
    diffPath: `${diffDir}/aboutUsTablet-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsTablet-report.html`,
    pageName: 'About Us Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - About Us Mobile visual should match Figma', async ({ page }) => {
  const aboutUs = new AboutUsPage(page, 'mobile');
  await aboutUs.goto();
  await scrollPage(page);
  const buffer = await aboutUs.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/aboutUs/aboutUsMobileFigma.png',
    actualPath: `${diffDir}/aboutUsMobile-actual.png`,
    diffPath: `${diffDir}/aboutUsMobile-diff.png`,
    expectedCopyPath: `${diffDir}/aboutUsMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/aboutUsMobile-report.html`,
    pageName: 'About Us Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined aboutUs multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/aboutUsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'About Us',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'aboutUsDesktop-expected.png',
        actualImage: 'aboutUsDesktop-actual.png',
        diffImage: 'aboutUsDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'aboutUsLaptop-expected.png',
        actualImage: 'aboutUsLaptop-actual.png',
        diffImage: 'aboutUsLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'aboutUsTablet-expected.png',
        actualImage: 'aboutUsTablet-actual.png',
        diffImage: 'aboutUsTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'aboutUsMobile-expected.png',
        actualImage: 'aboutUsMobile-actual.png',
        diffImage: 'aboutUsMobile-diff.png'
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
