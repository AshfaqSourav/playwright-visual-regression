import { test, expect } from '@playwright/test';
import { CulturePage } from '../../pages/aboutXsolla/CulturePage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutXsolla/culture/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutXsolla/culture/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutXsolla/culture/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutXsolla/culture/mobile';
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

test('A - Culture Desktop visual should match Figma', async ({ page }) => {
  const culture = new CulturePage(page, 'desktop');
  await culture.goto();
  await scrollPage(page);
  const buffer = await culture.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/culture/cultureDesktopFigma.png',
    actualPath: `${diffDir}/cultureDesktop-actual.png`,
    diffPath: `${diffDir}/cultureDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/cultureDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/cultureDesktop-report.html`,
    pageName: 'Culture Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Culture Laptop visual should match Figma', async ({ page }) => {
  const culture = new CulturePage(page, 'laptop');
  await culture.goto();
  await scrollPage(page);
  const buffer = await culture.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/culture/cultureLaptopFigma.png',
    actualPath: `${diffDir}/cultureLaptop-actual.png`,
    diffPath: `${diffDir}/cultureLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/cultureLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/cultureLaptop-report.html`,
    pageName: 'Culture Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Culture Tablet visual should match Figma', async ({ page }) => {
  const culture = new CulturePage(page, 'tablet');
  await culture.goto();
  await scrollPage(page);
  const buffer = await culture.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/culture/cultureTabletFigma.png',
    actualPath: `${diffDir}/cultureTablet-actual.png`,
    diffPath: `${diffDir}/cultureTablet-diff.png`,
    expectedCopyPath: `${diffDir}/cultureTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/cultureTablet-report.html`,
    pageName: 'Culture Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Culture Mobile visual should match Figma', async ({ page }) => {
  const culture = new CulturePage(page, 'mobile');
  await culture.goto();
  await scrollPage(page);
  const buffer = await culture.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/culture/cultureMobileFigma.png',
    actualPath: `${diffDir}/cultureMobile-actual.png`,
    diffPath: `${diffDir}/cultureMobile-diff.png`,
    expectedCopyPath: `${diffDir}/cultureMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/cultureMobile-report.html`,
    pageName: 'Culture Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined culture multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/cultureMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Culture',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'cultureDesktop-expected.png',
        actualImage: 'cultureDesktop-actual.png',
        diffImage: 'cultureDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'cultureLaptop-expected.png',
        actualImage: 'cultureLaptop-actual.png',
        diffImage: 'cultureLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'cultureTablet-expected.png',
        actualImage: 'cultureTablet-actual.png',
        diffImage: 'cultureTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'cultureMobile-expected.png',
        actualImage: 'cultureMobile-actual.png',
        diffImage: 'cultureMobile-diff.png'
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
