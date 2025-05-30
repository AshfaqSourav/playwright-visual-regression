import { test, expect } from '@playwright/test';
import { SiteMapPage } from '../../pages/staticPages/SiteMapPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/siteMap/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/siteMap/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/siteMap/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/siteMap/mobile';
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

test('A - Site Map Desktop visual should match Figma', async ({ page }) => {
  const siteMap = new SiteMapPage(page, 'desktop');
  await siteMap.goto();
  await scrollPage(page);
  const buffer = await siteMap.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteMap/siteMapDesktopFigma.png',
    actualPath: `${diffDir}/siteMapDesktop-actual.png`,
    diffPath: `${diffDir}/siteMapDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/siteMapDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteMapDesktop-report.html`,
    pageName: 'Site Map Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Site Map Laptop visual should match Figma', async ({ page }) => {
  const siteMap = new SiteMapPage(page, 'laptop');
  await siteMap.goto();
  await scrollPage(page);
  const buffer = await siteMap.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteMap/siteMapLaptopFigma.png',
    actualPath: `${diffDir}/siteMapLaptop-actual.png`,
    diffPath: `${diffDir}/siteMapLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/siteMapLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteMapLaptop-report.html`,
    pageName: 'Site Map Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Site Map Tablet visual should match Figma', async ({ page }) => {
  const siteMap = new SiteMapPage(page, 'tablet');
  await siteMap.goto();
  await scrollPage(page);
  const buffer = await siteMap.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteMap/siteMapTabletFigma.png',
    actualPath: `${diffDir}/siteMapTablet-actual.png`,
    diffPath: `${diffDir}/siteMapTablet-diff.png`,
    expectedCopyPath: `${diffDir}/siteMapTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteMapTablet-report.html`,
    pageName: 'Site Map Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Site Map Mobile visual should match Figma', async ({ page }) => {
  const siteMap = new SiteMapPage(page, 'mobile');
  await siteMap.goto();
  await scrollPage(page);
  const buffer = await siteMap.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteMap/siteMapMobileFigma.png',
    actualPath: `${diffDir}/siteMapMobile-actual.png`,
    diffPath: `${diffDir}/siteMapMobile-diff.png`,
    expectedCopyPath: `${diffDir}/siteMapMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteMapMobile-report.html`,
    pageName: 'Site Map Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined siteMap multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/siteMapMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Site Map',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'siteMapDesktop-expected.png',
        actualImage: 'siteMapDesktop-actual.png',
        diffImage: 'siteMapDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'siteMapLaptop-expected.png',
        actualImage: 'siteMapLaptop-actual.png',
        diffImage: 'siteMapLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'siteMapTablet-expected.png',
        actualImage: 'siteMapTablet-actual.png',
        diffImage: 'siteMapTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'siteMapMobile-expected.png',
        actualImage: 'siteMapMobile-actual.png',
        diffImage: 'siteMapMobile-diff.png'
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
