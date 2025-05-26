// /tests/specs/antiFraud.spec.ts

import { test, expect } from '@playwright/test';
import { AntiFraudPage } from '../../pages/products/AntiFraudPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/products/antiFraud/generateAntiFraudDesktopHtmlReport';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/products/antiFraud/generateAntiFraudLaptopHtmlReport';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/products/antiFraud/generateAntiFraudTabletHtmlReport';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/products/antiFraud/generateAntiFraudMobileHtmlReport';
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

// Desktop Test
test('A - Anti-Fraud Desktop visual should match Figma', async ({ page }) => {
  const antiFraud = new AntiFraudPage(page, 'desktop');
  await antiFraud.goto();
  await scrollPage(page);
  const buffer = await antiFraud.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/antiFraud/antiFraudDesktopFigma.png',
    actualPath: `${diffDir}/antiFraudDesktop-actual.png`,
    diffPath: `${diffDir}/antiFraudDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/antiFraudDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/antiFraudDesktop-report.html`,
    pageName: 'Anti-Fraud Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

// Laptop Test
test('B - Anti-Fraud Laptop visual should match Figma', async ({ page }) => {
  const antiFraud = new AntiFraudPage(page, 'laptop');
  await antiFraud.goto();
  await scrollPage(page);
  const buffer = await antiFraud.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/antiFraud/antiFraudLaptopFigma.png',
    actualPath: `${diffDir}/antiFraudLaptop-actual.png`,
    diffPath: `${diffDir}/antiFraudLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/antiFraudLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/antiFraudLaptop-report.html`,
    pageName: 'Anti-Fraud Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

// Tablet Test
test('C - Anti-Fraud Tablet visual should match Figma', async ({ page }) => {
  const antiFraud = new AntiFraudPage(page, 'tablet');
  await antiFraud.goto();
  await scrollPage(page);
  const buffer = await antiFraud.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/antiFraud/antiFraudTabletFigma.png',
    actualPath: `${diffDir}/antiFraudTablet-actual.png`,
    diffPath: `${diffDir}/antiFraudTablet-diff.png`,
    expectedCopyPath: `${diffDir}/antiFraudTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/antiFraudTablet-report.html`,
    pageName: 'Anti-Fraud Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

// Mobile Test
test('D - Anti-Fraud Mobile visual should match Figma', async ({ page }) => {
  const antiFraud = new AntiFraudPage(page, 'mobile');
  await antiFraud.goto();
  await scrollPage(page);
  const buffer = await antiFraud.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/antiFraud/antiFraudMobileFigma.png',
    actualPath: `${diffDir}/antiFraudMobile-actual.png`,
    diffPath: `${diffDir}/antiFraudMobile-diff.png`,
    expectedCopyPath: `${diffDir}/antiFraudMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/antiFraudMobile-report.html`,
    pageName: 'Anti-Fraud Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

// Combined Report
test('E - Generate combined anti-fraud multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/antiFraudMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Anti-Fraud',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'antiFraudDesktop-expected.png',
        actualImage: 'antiFraudDesktop-actual.png',
        diffImage: 'antiFraudDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'antiFraudLaptop-expected.png',
        actualImage: 'antiFraudLaptop-actual.png',
        diffImage: 'antiFraudLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'antiFraudTablet-expected.png',
        actualImage: 'antiFraudTablet-actual.png',
        diffImage: 'antiFraudTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'antiFraudMobile-expected.png',
        actualImage: 'antiFraudMobile-actual.png',
        diffImage: 'antiFraudMobile-diff.png'
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
