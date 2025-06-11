import { test, expect } from '@playwright/test';
import { SellVirtualGoodsPage } from '../../pages/XpsLandingPages/SellVirtualGoodsPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/xpsLandingPages/sellVirtualGoods/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/xpsLandingPages/sellVirtualGoods/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/xpsLandingPages/sellVirtualGoods/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/xpsLandingPages/sellVirtualGoods/mobile';
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

test('A - sellVirtualGoods Desktop visual should match Figma', async ({ page }) => {
  const sellVirtualGoods = new SellVirtualGoodsPage(page, 'desktop');
  await sellVirtualGoods.goto();
  await scrollPage(page);
  const buffer = await sellVirtualGoods.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellVirtualGoods/sellVirtualGoodsDesktopFigma.png',
    actualPath: `${diffDir}/sellVirtualGoodsDesktop-actual.png`,
    diffPath: `${diffDir}/sellVirtualGoodsDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/sellVirtualGoodsDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellVirtualGoodsDesktop-report.html`,
    pageName: 'sellVirtualGoods Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - sellVirtualGoods Laptop visual should match Figma', async ({ page }) => {
  const sellVirtualGoods = new SellVirtualGoodsPage(page, 'laptop');
  await sellVirtualGoods.goto();
  await scrollPage(page);
  const buffer = await sellVirtualGoods.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellVirtualGoods/sellVirtualGoodsLaptopFigma.png',
    actualPath: `${diffDir}/sellVirtualGoodsLaptop-actual.png`,
    diffPath: `${diffDir}/sellVirtualGoodsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/sellVirtualGoodsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellVirtualGoodsLaptop-report.html`,
    pageName: 'sellVirtualGoods Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - sellVirtualGoods Tablet visual should match Figma', async ({ page }) => {
  const sellVirtualGoods = new SellVirtualGoodsPage(page, 'tablet');
  await sellVirtualGoods.goto();
  await scrollPage(page);
  const buffer = await sellVirtualGoods.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellVirtualGoods/sellVirtualGoodsTabletFigma.png',
    actualPath: `${diffDir}/sellVirtualGoodsTablet-actual.png`,
    diffPath: `${diffDir}/sellVirtualGoodsTablet-diff.png`,
    expectedCopyPath: `${diffDir}/sellVirtualGoodsTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellVirtualGoodsTablet-report.html`,
    pageName: 'sellVirtualGoods Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - sellVirtualGoods Mobile visual should match Figma', async ({ page }) => {
  const sellVirtualGoods = new SellVirtualGoodsPage(page, 'mobile');
  await sellVirtualGoods.goto();
  await scrollPage(page);
  const buffer = await sellVirtualGoods.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sellVirtualGoods/sellVirtualGoodsMobileFigma.png',
    actualPath: `${diffDir}/sellVirtualGoodsMobile-actual.png`,
    diffPath: `${diffDir}/sellVirtualGoodsMobile-diff.png`,
    expectedCopyPath: `${diffDir}/sellVirtualGoodsMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sellVirtualGoodsMobile-report.html`,
    pageName: 'sellVirtualGoods Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined sellVirtualGoods multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/sellVirtualGoodsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'sellVirtualGoods',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'sellVirtualGoodsDesktop-expected.png',
        actualImage: 'sellVirtualGoodsDesktop-actual.png',
        diffImage: 'sellVirtualGoodsDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'sellVirtualGoodsLaptop-expected.png',
        actualImage: 'sellVirtualGoodsLaptop-actual.png',
        diffImage: 'sellVirtualGoodsLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'sellVirtualGoodsTablet-expected.png',
        actualImage: 'sellVirtualGoodsTablet-actual.png',
        diffImage: 'sellVirtualGoodsTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'sellVirtualGoodsMobile-expected.png',
        actualImage: 'sellVirtualGoodsMobile-actual.png',
        diffImage: 'sellVirtualGoodsMobile-diff.png'
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
