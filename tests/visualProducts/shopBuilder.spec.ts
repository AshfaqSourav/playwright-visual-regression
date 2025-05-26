import { test, expect } from '@playwright/test';
import { ShopBuilderPage } from '../../pages/products/ShopBuilderPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/products/shopBuilder/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/products/shopBuilder/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/products/shopBuilder/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/products/shopBuilder/mobile';
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

test('A- hop Builder Desktop visual should match Figma', async ({ page }) => {
  const shopBuilder = new ShopBuilderPage(page, 'desktop');
  await shopBuilder.goto();
  await scrollPage(page);
  const buffer = await shopBuilder.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/shopBuilder/shopBuilderDesktopFigma.png',
    actualPath: `${diffDir}/shopBuilderDesktop-actual.png`,
    diffPath: `${diffDir}/shopBuilderDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/shopBuilderDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/shopBuilderDesktop-report.html`,
    pageName: 'Shop Builder Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Shop Builder Laptop visual should match Figma', async ({ page }) => {
  const shopBuilder = new ShopBuilderPage(page, 'laptop');
  await shopBuilder.goto();
  await scrollPage(page);
  const buffer = await shopBuilder.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/shopBuilder/shopBuilderLaptopFigma.png',
    actualPath: `${diffDir}/shopBuilderLaptop-actual.png`,
    diffPath: `${diffDir}/shopBuilderLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/shopBuilderLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/shopBuilderLaptop-report.html`,
    pageName: 'Shop Builder Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Shop Builder Tablet visual should match Figma', async ({ page }) => {
  const shopBuilder = new ShopBuilderPage(page, 'tablet');
  await shopBuilder.goto();
  await scrollPage(page);
  const buffer = await shopBuilder.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/shopBuilder/shopBuilderTabletFigma.png',
    actualPath: `${diffDir}/shopBuilderTablet-actual.png`,
    diffPath: `${diffDir}/shopBuilderTablet-diff.png`,
    expectedCopyPath: `${diffDir}/shopBuilderTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/shopBuilderTablet-report.html`,
    pageName: 'Shop Builder Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Shop Builder Mobile visual should match Figma', async ({ page }) => {
  const shopBuilder = new ShopBuilderPage(page, 'mobile');
  await shopBuilder.goto();
  await scrollPage(page);
  const buffer = await shopBuilder.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/shopBuilder/shopBuilderMobileFigma.png',
    actualPath: `${diffDir}/shopBuilderMobile-actual.png`,
    diffPath: `${diffDir}/shopBuilderMobile-diff.png`,
    expectedCopyPath: `${diffDir}/shopBuilderMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/shopBuilderMobile-report.html`,
    pageName: 'Shop Builder Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined shop-builder multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/shopBuilderMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Shop Builder',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'shopBuilderDesktop-expected.png',
        actualImage: 'shopBuilderDesktop-actual.png',
        diffImage: 'shopBuilderDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'shopBuilderLaptop-expected.png',
        actualImage: 'shopBuilderLaptop-actual.png',
        diffImage: 'shopBuilderLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'shopBuilderTablet-expected.png',
        actualImage: 'shopBuilderTablet-actual.png',
        diffImage: 'shopBuilderTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'shopBuilderMobile-expected.png',
        actualImage: 'shopBuilderMobile-actual.png',
        diffImage: 'shopBuilderMobile-diff.png'
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
