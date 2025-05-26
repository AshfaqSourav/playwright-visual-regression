// /tests/visualWebShop/wsParentPage.spec.ts

import { test, expect } from '@playwright/test';
import { WSParentPage } from '../../pages/webShop/WSParentPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/parentPage/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/parentPage/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/parentPage/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/parentPage/mobile';
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

test('A - WS Parent Page Desktop visual should match Figma', async ({ page }) => {
  const wsPage = new WSParentPage(page, 'desktop');
  await wsPage.goto();
  await scrollPage(page);
  const buffer = await wsPage.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsParentPage/wsParentPageDesktopFigma.png',
    actualPath: `${diffDir}/wsParentPageDesktop-actual.png`,
    diffPath: `${diffDir}/wsParentPageDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsParentPageDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsParentPageDesktop-report.html`,
    pageName: 'WS Parent Page Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS Parent Page Laptop visual should match Figma', async ({ page }) => {
  const wsPage = new WSParentPage(page, 'laptop');
  await wsPage.goto();
  await scrollPage(page);
  const buffer = await wsPage.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsParentPage/wsParentPageLaptopFigma.png',
    actualPath: `${diffDir}/wsParentPageLaptop-actual.png`,
    diffPath: `${diffDir}/wsParentPageLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsParentPageLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsParentPageLaptop-report.html`,
    pageName: 'WS Parent Page Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS Parent Page Tablet visual should match Figma', async ({ page }) => {
  const wsPage = new WSParentPage(page, 'tablet');
  await wsPage.goto();
  await scrollPage(page);
  const buffer = await wsPage.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsParentPage/wsParentPageTabletFigma.png',
    actualPath: `${diffDir}/wsParentPageTablet-actual.png`,
    diffPath: `${diffDir}/wsParentPageTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsParentPageTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsParentPageTablet-report.html`,
    pageName: 'WS Parent Page Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS Parent Page Mobile visual should match Figma', async ({ page }) => {
  const wsPage = new WSParentPage(page, 'mobile');
  await wsPage.goto();
  await scrollPage(page);
  const buffer = await wsPage.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsParentPage/wsParentPageMobileFigma.png',
    actualPath: `${diffDir}/wsParentPageMobile-actual.png`,
    diffPath: `${diffDir}/wsParentPageMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsParentPageMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsParentPageMobile-report.html`,
    pageName: 'WS Parent Page Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Combined WS Parent Page Multi-Viewport Report', async () => {
  const reportPath = path.resolve(`${diffDir}/wsParentPageMultiViewportReport.html`);
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS Parent Page',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsParentPageDesktop-expected.png',
        actualImage: 'wsParentPageDesktop-actual.png',
        diffImage: 'wsParentPageDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsParentPageLaptop-expected.png',
        actualImage: 'wsParentPageLaptop-actual.png',
        diffImage: 'wsParentPageLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsParentPageTablet-expected.png',
        actualImage: 'wsParentPageTablet-actual.png',
        diffImage: 'wsParentPageTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsParentPageMobile-expected.png',
        actualImage: 'wsParentPageMobile-actual.png',
        diffImage: 'wsParentPageMobile-diff.png'
      }
    ]
  });

  if (fs.existsSync(reportPath)) {
    const openCommand = process.platform === 'win32'
      ? `start "" "${reportPath}"`
      : process.platform === 'darwin'
      ? `open "${reportPath}"`
      : `xdg-open "${reportPath}"`;

    await new Promise((resolve) => {
      exec(openCommand, err => {
        if (err) console.warn('⚠️ Failed to open report:', err.message);
        else console.log('✅ Opened report in browser');
        resolve(true);
      });
    });
  }
});
