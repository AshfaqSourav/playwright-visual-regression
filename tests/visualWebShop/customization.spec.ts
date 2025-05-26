// /tests/visualWebShop/wsCustomization.spec.ts

import { test, expect } from '@playwright/test';
import { WSCustomizationPage } from '../../pages/webShop/WSCustomizationPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/customization/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/customization/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/customization/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/customization/mobile';
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

test('A - WS Customization Desktop visual should match Figma', async ({ page }) => {
  const wsCustom = new WSCustomizationPage(page, 'desktop');
  await wsCustom.goto();
  await scrollPage(page);
  const buffer = await wsCustom.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCustomization/wsCustomizationDesktopFigma.png',
    actualPath: `${diffDir}/wsCustomizationDesktop-actual.png`,
    diffPath: `${diffDir}/wsCustomizationDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsCustomizationDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCustomizationDesktop-report.html`,
    pageName: 'WS Customization Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS Customization Laptop visual should match Figma', async ({ page }) => {
  const wsCustom = new WSCustomizationPage(page, 'laptop');
  await wsCustom.goto();
  await scrollPage(page);
  const buffer = await wsCustom.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCustomization/wsCustomizationLaptopFigma.png',
    actualPath: `${diffDir}/wsCustomizationLaptop-actual.png`,
    diffPath: `${diffDir}/wsCustomizationLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsCustomizationLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCustomizationLaptop-report.html`,
    pageName: 'WS Customization Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS Customization Tablet visual should match Figma', async ({ page }) => {
  const wsCustom = new WSCustomizationPage(page, 'tablet');
  await wsCustom.goto();
  await scrollPage(page);
  const buffer = await wsCustom.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCustomization/wsCustomizationTabletFigma.png',
    actualPath: `${diffDir}/wsCustomizationTablet-actual.png`,
    diffPath: `${diffDir}/wsCustomizationTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsCustomizationTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCustomizationTablet-report.html`,
    pageName: 'WS Customization Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS Customization Mobile visual should match Figma', async ({ page }) => {
  const wsCustom = new WSCustomizationPage(page, 'mobile');
  await wsCustom.goto();
  await scrollPage(page);
  const buffer = await wsCustom.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCustomization/wsCustomizationMobileFigma.png',
    actualPath: `${diffDir}/wsCustomizationMobile-actual.png`,
    diffPath: `${diffDir}/wsCustomizationMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsCustomizationMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCustomizationMobile-report.html`,
    pageName: 'WS Customization Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Combined WS Customization Multi-Viewport Report', async () => {
  const reportPath = path.resolve(`${diffDir}/wsCustomizationMultiViewportReport.html`);
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS Customization',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsCustomizationDesktop-expected.png',
        actualImage: 'wsCustomizationDesktop-actual.png',
        diffImage: 'wsCustomizationDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsCustomizationLaptop-expected.png',
        actualImage: 'wsCustomizationLaptop-actual.png',
        diffImage: 'wsCustomizationLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsCustomizationTablet-expected.png',
        actualImage: 'wsCustomizationTablet-actual.png',
        diffImage: 'wsCustomizationTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsCustomizationMobile-expected.png',
        actualImage: 'wsCustomizationMobile-actual.png',
        diffImage: 'wsCustomizationMobile-diff.png'
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
