import { test, expect } from '@playwright/test';
import { TaxManagementPage } from '../../pages/staticPages/TaxManagementPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/taxManagement/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/taxManagement/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/taxManagement/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/taxManagement/mobile';
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

test('A - Tax Management Desktop visual should match Figma', async ({ page }) => {
  const taxManagement = new TaxManagementPage(page, 'desktop');
  await taxManagement.goto();
  await scrollPage(page);
  const buffer = await taxManagement.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/taxManagement/taxManagementDesktopFigma.png',
    actualPath: `${diffDir}/taxManagementDesktop-actual.png`,
    diffPath: `${diffDir}/taxManagementDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/taxManagementDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/taxManagementDesktop-report.html`,
    pageName: 'Tax Management Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Tax Management Laptop visual should match Figma', async ({ page }) => {
  const taxManagement = new TaxManagementPage(page, 'laptop');
  await taxManagement.goto();
  await scrollPage(page);
  const buffer = await taxManagement.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/taxManagement/taxManagementLaptopFigma.png',
    actualPath: `${diffDir}/taxManagementLaptop-actual.png`,
    diffPath: `${diffDir}/taxManagementLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/taxManagementLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/taxManagementLaptop-report.html`,
    pageName: 'Tax Management Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Tax Management Tablet visual should match Figma', async ({ page }) => {
  const taxManagement = new TaxManagementPage(page, 'tablet');
  await taxManagement.goto();
  await scrollPage(page);
  const buffer = await taxManagement.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/taxManagement/taxManagementTabletFigma.png',
    actualPath: `${diffDir}/taxManagementTablet-actual.png`,
    diffPath: `${diffDir}/taxManagementTablet-diff.png`,
    expectedCopyPath: `${diffDir}/taxManagementTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/taxManagementTablet-report.html`,
    pageName: 'Tax Management Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Tax Management Mobile visual should match Figma', async ({ page }) => {
  const taxManagement = new TaxManagementPage(page, 'mobile');
  await taxManagement.goto();
  await scrollPage(page);
  const buffer = await taxManagement.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/taxManagement/taxManagementMobileFigma.png',
    actualPath: `${diffDir}/taxManagementMobile-actual.png`,
    diffPath: `${diffDir}/taxManagementMobile-diff.png`,
    expectedCopyPath: `${diffDir}/taxManagementMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/taxManagementMobile-report.html`,
    pageName: 'Tax Management Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined taxManagement multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/taxManagementMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Tax Management',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'taxManagementDesktop-expected.png',
        actualImage: 'taxManagementDesktop-actual.png',
        diffImage: 'taxManagementDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'taxManagementLaptop-expected.png',
        actualImage: 'taxManagementLaptop-actual.png',
        diffImage: 'taxManagementLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'taxManagementTablet-expected.png',
        actualImage: 'taxManagementTablet-actual.png',
        diffImage: 'taxManagementTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'taxManagementMobile-expected.png',
        actualImage: 'taxManagementMobile-actual.png',
        diffImage: 'taxManagementMobile-diff.png'
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
