import { test, expect } from '@playwright/test';
import { EcosystemPage } from '../../pages/aboutXsolla/EcosystemPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutXsolla/ecosystem/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutXsolla/ecosystem/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutXsolla/ecosystem/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutXsolla/ecosystem/mobile';
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

test('A - Ecosystem Desktop visual should match Figma', async ({ page }) => {
  const ecosystem = new EcosystemPage(page, 'desktop');
  await ecosystem.goto();
  await scrollPage(page);
  const buffer = await ecosystem.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecosystem/ecosystemDesktopFigma.png',
    actualPath: `${diffDir}/ecosystemDesktop-actual.png`,
    diffPath: `${diffDir}/ecosystemDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/ecosystemDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecosystemDesktop-report.html`,
    pageName: 'Ecosystem Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Ecosystem Laptop visual should match Figma', async ({ page }) => {
  const ecosystem = new EcosystemPage(page, 'laptop');
  await ecosystem.goto();
  await scrollPage(page);
  const buffer = await ecosystem.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecosystem/ecosystemLaptopFigma.png',
    actualPath: `${diffDir}/ecosystemLaptop-actual.png`,
    diffPath: `${diffDir}/ecosystemLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/ecosystemLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecosystemLaptop-report.html`,
    pageName: 'Ecosystem Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Ecosystem Tablet visual should match Figma', async ({ page }) => {
  const ecosystem = new EcosystemPage(page, 'tablet');
  await ecosystem.goto();
  await scrollPage(page);
  const buffer = await ecosystem.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecosystem/ecosystemTabletFigma.png',
    actualPath: `${diffDir}/ecosystemTablet-actual.png`,
    diffPath: `${diffDir}/ecosystemTablet-diff.png`,
    expectedCopyPath: `${diffDir}/ecosystemTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecosystemTablet-report.html`,
    pageName: 'Ecosystem Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Ecosystem Mobile visual should match Figma', async ({ page }) => {
  const ecosystem = new EcosystemPage(page, 'mobile');
  await ecosystem.goto();
  await scrollPage(page);
  const buffer = await ecosystem.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecosystem/ecosystemMobileFigma.png',
    actualPath: `${diffDir}/ecosystemMobile-actual.png`,
    diffPath: `${diffDir}/ecosystemMobile-diff.png`,
    expectedCopyPath: `${diffDir}/ecosystemMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecosystemMobile-report.html`,
    pageName: 'Ecosystem Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined ecosystem multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/ecosystemMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Ecosystem',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'ecosystemDesktop-expected.png',
        actualImage: 'ecosystemDesktop-actual.png',
        diffImage: 'ecosystemDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'ecosystemLaptop-expected.png',
        actualImage: 'ecosystemLaptop-actual.png',
        diffImage: 'ecosystemLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'ecosystemTablet-expected.png',
        actualImage: 'ecosystemTablet-actual.png',
        diffImage: 'ecosystemTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'ecosystemMobile-expected.png',
        actualImage: 'ecosystemMobile-actual.png',
        diffImage: 'ecosystemMobile-diff.png'
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
