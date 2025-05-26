// /tests/visualWebShop/wsWebPortal.spec.ts

import { test, expect } from '@playwright/test';
import { WSWebPortalPage } from '../../pages/webShop/WSWebPortalPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/webPortal/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/webPortal/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/webPortal/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/webPortal/mobile';
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

test('A - WS WebPortal Desktop visual should match Figma', async ({ page }) => {
  const wsWebPortal = new WSWebPortalPage(page, 'desktop');
  await wsWebPortal.goto();
  await scrollPage(page);
  const buffer = await wsWebPortal.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsWebPortal/wsWebPortalDesktopFigma.png',
    actualPath: `${diffDir}/wsWebPortalDesktop-actual.png`,
    diffPath: `${diffDir}/wsWebPortalDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsWebPortalDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsWebPortalDesktop-report.html`,
    pageName: 'WS WebPortal Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS WebPortal Laptop visual should match Figma', async ({ page }) => {
  const wsWebPortal = new WSWebPortalPage(page, 'laptop');
  await wsWebPortal.goto();
  await scrollPage(page);
  const buffer = await wsWebPortal.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsWebPortal/wsWebPortalLaptopFigma.png',
    actualPath: `${diffDir}/wsWebPortalLaptop-actual.png`,
    diffPath: `${diffDir}/wsWebPortalLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsWebPortalLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsWebPortalLaptop-report.html`,
    pageName: 'WS WebPortal Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS WebPortal Tablet visual should match Figma', async ({ page }) => {
  const wsWebPortal = new WSWebPortalPage(page, 'tablet');
  await wsWebPortal.goto();
  await scrollPage(page);
  const buffer = await wsWebPortal.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsWebPortal/wsWebPortalTabletFigma.png',
    actualPath: `${diffDir}/wsWebPortalTablet-actual.png`,
    diffPath: `${diffDir}/wsWebPortalTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsWebPortalTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsWebPortalTablet-report.html`,
    pageName: 'WS WebPortal Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS WebPortal Mobile visual should match Figma', async ({ page }) => {
  const wsWebPortal = new WSWebPortalPage(page, 'mobile');
  await wsWebPortal.goto();
  await scrollPage(page);
  const buffer = await wsWebPortal.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsWebPortal/wsWebPortalMobileFigma.png',
    actualPath: `${diffDir}/wsWebPortalMobile-actual.png`,
    diffPath: `${diffDir}/wsWebPortalMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsWebPortalMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsWebPortalMobile-report.html`,
    pageName: 'WS WebPortal Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined WS WebPortal multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/wsWebPortalMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS WebPortal',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsWebPortalDesktop-expected.png',
        actualImage: 'wsWebPortalDesktop-actual.png',
        diffImage: 'wsWebPortalDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsWebPortalLaptop-expected.png',
        actualImage: 'wsWebPortalLaptop-actual.png',
        diffImage: 'wsWebPortalLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsWebPortalTablet-expected.png',
        actualImage: 'wsWebPortalTablet-actual.png',
        diffImage: 'wsWebPortalTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsWebPortalMobile-expected.png',
        actualImage: 'wsWebPortalMobile-actual.png',
        diffImage: 'wsWebPortalMobile-diff.png'
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
