import { test, expect } from '@playwright/test';
import { WSCatalogueManagementPage } from '../../pages/webShop/WSCatalogueManagementPage'
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/webShop/catalogueManagement/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/webShop/catalogueManagement/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/webShop/catalogueManagement/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/webShop/catalogueManagement/mobile';
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

test('A - WS Catalogue Management Desktop visual should match Figma', async ({ page }) => {
  const wsCat = new WSCatalogueManagementPage(page, 'desktop');
  await wsCat.goto();
  await scrollPage(page);
  const buffer = await wsCat.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCatalogueManagement/wsCatalogueManagementDesktopFigma.png',
    actualPath: `${diffDir}/wsCatalogueManagementDesktop-actual.png`,
    diffPath: `${diffDir}/wsCatalogueManagementDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/wsCatalogueManagementDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCatalogueManagementDesktop-report.html`,
    pageName: 'WS Catalogue Management Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - WS Catalogue Management Laptop visual should match Figma', async ({ page }) => {
  const wsCat = new WSCatalogueManagementPage(page, 'laptop');
  await wsCat.goto();
  await scrollPage(page);
  const buffer = await wsCat.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCatalogueManagement/wsCatalogueManagementLaptopFigma.png',
    actualPath: `${diffDir}/wsCatalogueManagementLaptop-actual.png`,
    diffPath: `${diffDir}/wsCatalogueManagementLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/wsCatalogueManagementLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCatalogueManagementLaptop-report.html`,
    pageName: 'WS Catalogue Management Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - WS Catalogue Management Tablet visual should match Figma', async ({ page }) => {
  const wsCat = new WSCatalogueManagementPage(page, 'tablet');
  await wsCat.goto();
  await scrollPage(page);
  const buffer = await wsCat.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCatalogueManagement/wsCatalogueManagementTabletFigma.png',
    actualPath: `${diffDir}/wsCatalogueManagementTablet-actual.png`,
    diffPath: `${diffDir}/wsCatalogueManagementTablet-diff.png`,
    expectedCopyPath: `${diffDir}/wsCatalogueManagementTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCatalogueManagementTablet-report.html`,
    pageName: 'WS Catalogue Management Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - WS Catalogue Management Mobile visual should match Figma', async ({ page }) => {
  const wsCat = new WSCatalogueManagementPage(page, 'mobile');
  await wsCat.goto();
  await scrollPage(page);
  const buffer = await wsCat.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/wsCatalogueManagement/wsCatalogueManagementMobileFigma.png',
    actualPath: `${diffDir}/wsCatalogueManagementMobile-actual.png`,
    diffPath: `${diffDir}/wsCatalogueManagementMobile-diff.png`,
    expectedCopyPath: `${diffDir}/wsCatalogueManagementMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/wsCatalogueManagementMobile-report.html`,
    pageName: 'WS Catalogue Management Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Combined Report for WS Catalogue Management', async () => {
  const reportPath = path.resolve(`${diffDir}/wsCatalogueManagementMultiViewportReport.html`);
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'WS Catalogue Management',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'wsCatalogueManagementDesktop-expected.png',
        actualImage: 'wsCatalogueManagementDesktop-actual.png',
        diffImage: 'wsCatalogueManagementDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'wsCatalogueManagementLaptop-expected.png',
        actualImage: 'wsCatalogueManagementLaptop-actual.png',
        diffImage: 'wsCatalogueManagementLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'wsCatalogueManagementTablet-expected.png',
        actualImage: 'wsCatalogueManagementTablet-actual.png',
        diffImage: 'wsCatalogueManagementTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'wsCatalogueManagementMobile-expected.png',
        actualImage: 'wsCatalogueManagementMobile-actual.png',
        diffImage: 'wsCatalogueManagementMobile-diff.png'
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
