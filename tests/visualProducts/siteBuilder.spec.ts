import { test, expect } from '@playwright/test';
import { SiteBuilderPage } from '../../pages/products/SiteBuilderPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/products/siteBuilder/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/products/siteBuilder/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/products/siteBuilder/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/products/siteBuilder/mobile';
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

test('A - Site Builder Desktop visual should match Figma', async ({ page }) => {
  const siteBuilder = new SiteBuilderPage(page, 'desktop');
  await siteBuilder.goto();
  await scrollPage(page);
  const buffer = await siteBuilder.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteBuilder/siteBuilderDesktopFigma.png',
    actualPath: `${diffDir}/siteBuilderDesktop-actual.png`,
    diffPath: `${diffDir}/siteBuilderDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/siteBuilderDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteBuilderDesktop-report.html`,
    pageName: 'Site Builder Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Site Builder Laptop visual should match Figma', async ({ page }) => {
  const siteBuilder = new SiteBuilderPage(page, 'laptop');
  await siteBuilder.goto();
  await scrollPage(page);
  const buffer = await siteBuilder.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteBuilder/siteBuilderLaptopFigma.png',
    actualPath: `${diffDir}/siteBuilderLaptop-actual.png`,
    diffPath: `${diffDir}/siteBuilderLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/siteBuilderLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteBuilderLaptop-report.html`,
    pageName: 'Site Builder Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Site Builder Tablet visual should match Figma', async ({ page }) => {
  const siteBuilder = new SiteBuilderPage(page, 'tablet');
  await siteBuilder.goto();
  await scrollPage(page);
  const buffer = await siteBuilder.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteBuilder/siteBuilderTabletFigma.png',
    actualPath: `${diffDir}/siteBuilderTablet-actual.png`,
    diffPath: `${diffDir}/siteBuilderTablet-diff.png`,
    expectedCopyPath: `${diffDir}/siteBuilderTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteBuilderTablet-report.html`,
    pageName: 'Site Builder Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Site Builder Mobile visual should match Figma', async ({ page }) => {
  const siteBuilder = new SiteBuilderPage(page, 'mobile');
  await siteBuilder.goto();
  await scrollPage(page);
  const buffer = await siteBuilder.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/siteBuilder/siteBuilderMobileFigma.png',
    actualPath: `${diffDir}/siteBuilderMobile-actual.png`,
    diffPath: `${diffDir}/siteBuilderMobile-diff.png`,
    expectedCopyPath: `${diffDir}/siteBuilderMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/siteBuilderMobile-report.html`,
    pageName: 'Site Builder Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined site-builder multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/siteBuilderMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Site Builder',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'siteBuilderDesktop-expected.png',
        actualImage: 'siteBuilderDesktop-actual.png',
        diffImage: 'siteBuilderDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'siteBuilderLaptop-expected.png',
        actualImage: 'siteBuilderLaptop-actual.png',
        diffImage: 'siteBuilderLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'siteBuilderTablet-expected.png',
        actualImage: 'siteBuilderTablet-actual.png',
        diffImage: 'siteBuilderTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'siteBuilderMobile-expected.png',
        actualImage: 'siteBuilderMobile-actual.png',
        diffImage: 'siteBuilderMobile-diff.png'
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
