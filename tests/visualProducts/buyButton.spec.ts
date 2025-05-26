import { test, expect } from '@playwright/test';
import { BuyButtonPage } from '../../pages/products/BuyButtonPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/products/buyButton/BuyButtonDesktopReport';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/products/buyButton/BuyButtonLaptopReport';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/products/buyButton/BuyButtonTabletReport';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/products/buyButton/BuyButtonMobileReport';
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

test('A - Buy Button Desktop visual should match Figma', async ({ page }) => {
  const buyButton = new BuyButtonPage(page, 'desktop');
  await buyButton.goto();
  await scrollPage(page);
  const buffer = await buyButton.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/buyButton/buyButtonDesktopFigma.png',
    actualPath: `${diffDir}/buyButtonDesktop-actual.png`,
    diffPath: `${diffDir}/buyButtonDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/buyButtonDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/buyButtonDesktop-report.html`,
    pageName: 'Buy Button Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Buy Button Laptop visual should match Figma', async ({ page }) => {
  const buyButton = new BuyButtonPage(page, 'laptop');
  await buyButton.goto();
  await scrollPage(page);
  const buffer = await buyButton.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/buyButton/buyButtonLaptopFigma.png',
    actualPath: `${diffDir}/buyButtonLaptop-actual.png`,
    diffPath: `${diffDir}/buyButtonLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/buyButtonLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/buyButtonLaptop-report.html`,
    pageName: 'Buy Button Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Buy Button Tablet visual should match Figma', async ({ page }) => {
  const buyButton = new BuyButtonPage(page, 'tablet');
  await buyButton.goto();
  await scrollPage(page);
  const buffer = await buyButton.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/buyButton/buyButtonTabletFigma.png',
    actualPath: `${diffDir}/buyButtonTablet-actual.png`,
    diffPath: `${diffDir}/buyButtonTablet-diff.png`,
    expectedCopyPath: `${diffDir}/buyButtonTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/buyButtonTablet-report.html`,
    pageName: 'Buy Button Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Buy Button Mobile visual should match Figma', async ({ page }) => {
  const buyButton = new BuyButtonPage(page, 'mobile');
  await buyButton.goto();
  await scrollPage(page);
  const buffer = await buyButton.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/buyButton/buyButtonMobileFigma.png',
    actualPath: `${diffDir}/buyButtonMobile-actual.png`,
    diffPath: `${diffDir}/buyButtonMobile-diff.png`,
    expectedCopyPath: `${diffDir}/buyButtonMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/buyButtonMobile-report.html`,
    pageName: 'Buy Button Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined buy-button multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/buyButtonMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Buy Button',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'buyButtonDesktop-expected.png',
        actualImage: 'buyButtonDesktop-actual.png',
        diffImage: 'buyButtonDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'buyButtonLaptop-expected.png',
        actualImage: 'buyButtonLaptop-actual.png',
        diffImage: 'buyButtonLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'buyButtonTablet-expected.png',
        actualImage: 'buyButtonTablet-actual.png',
        diffImage: 'buyButtonTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'buyButtonMobile-expected.png',
        actualImage: 'buyButtonMobile-actual.png',
        diffImage: 'buyButtonMobile-diff.png'
      }
    ]
  });

  if (fs.existsSync(reportPath)) {
    const openCommand =
      process.platform === 'win32'
        ? `start "" "${reportPath}"`
        : process.platform === 'darwin'
        ? `open "${reportPath}"`
        : `xdg-open "${reportPath}"`;

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
