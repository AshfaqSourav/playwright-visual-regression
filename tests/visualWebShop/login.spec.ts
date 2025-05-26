// /tests/visualWebShop/wsLogin.spec.ts

import { test, expect } from '@playwright/test';
import { WSLoginPage } from '../../pages/webShop/WSLoginPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/login/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/login/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/login/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/login/mobile';
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

test('A - WS Login Desktop visual should match Figma', async ({ page }) => {
  const wsLogin = new WSLoginPage(page, 'desktop');
  await wsLogin.goto();
  await scrollPage(page);
  const buffer = await wsLogin.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLogin/wsLoginDesktopFigma.png',
    actualPath: `${diffDir}/wsLoginDesktop-actual.png`,
    diffPath: `${diffDir}/wsLoginDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsLoginDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLoginDesktop-report.html`,
    pageName: 'WS Login Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS Login Laptop visual should match Figma', async ({ page }) => {
  const wsLogin = new WSLoginPage(page, 'laptop');
  await wsLogin.goto();
  await scrollPage(page);
  const buffer = await wsLogin.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLogin/wsLoginLaptopFigma.png',
    actualPath: `${diffDir}/wsLoginLaptop-actual.png`,
    diffPath: `${diffDir}/wsLoginLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsLoginLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLoginLaptop-report.html`,
    pageName: 'WS Login Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS Login Tablet visual should match Figma', async ({ page }) => {
  const wsLogin = new WSLoginPage(page, 'tablet');
  await wsLogin.goto();
  await scrollPage(page);
  const buffer = await wsLogin.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLogin/wsLoginTabletFigma.png',
    actualPath: `${diffDir}/wsLoginTablet-actual.png`,
    diffPath: `${diffDir}/wsLoginTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsLoginTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLoginTablet-report.html`,
    pageName: 'WS Login Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS Login Mobile visual should match Figma', async ({ page }) => {
  const wsLogin = new WSLoginPage(page, 'mobile');
  await wsLogin.goto();
  await scrollPage(page);
  const buffer = await wsLogin.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsLogin/wsLoginMobileFigma.png',
    actualPath: `${diffDir}/wsLoginMobile-actual.png`,
    diffPath: `${diffDir}/wsLoginMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsLoginMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsLoginMobile-report.html`,
    pageName: 'WS Login Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined WS Login multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/wsLoginMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS Login',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsLoginDesktop-expected.png',
        actualImage: 'wsLoginDesktop-actual.png',
        diffImage: 'wsLoginDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsLoginLaptop-expected.png',
        actualImage: 'wsLoginLaptop-actual.png',
        diffImage: 'wsLoginLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsLoginTablet-expected.png',
        actualImage: 'wsLoginTablet-actual.png',
        diffImage: 'wsLoginTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsLoginMobile-expected.png',
        actualImage: 'wsLoginMobile-actual.png',
        diffImage: 'wsLoginMobile-diff.png'
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
