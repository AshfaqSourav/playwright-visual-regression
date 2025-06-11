import { test, expect } from '@playwright/test';
import { SecurityPage } from '../../pages/aboutXsolla/SecurityPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutXsolla/security/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutXsolla/security/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutXsolla/security/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutXsolla/security/mobile';
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

test('A - Security Desktop visual should match Figma', async ({ page }) => {
  const security = new SecurityPage(page, 'desktop');
  await security.goto();
  await scrollPage(page);
  const buffer = await security.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/security/securityDesktopFigma.png',
    actualPath: `${diffDir}/securityDesktop-actual.png`,
    diffPath: `${diffDir}/securityDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/securityDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/securityDesktop-report.html`,
    pageName: 'Security Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Security Laptop visual should match Figma', async ({ page }) => {
  const security = new SecurityPage(page, 'laptop');
  await security.goto();
  await scrollPage(page);
  const buffer = await security.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/security/securityLaptopFigma.png',
    actualPath: `${diffDir}/securityLaptop-actual.png`,
    diffPath: `${diffDir}/securityLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/securityLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/securityLaptop-report.html`,
    pageName: 'Security Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Security Tablet visual should match Figma', async ({ page }) => {
  const security = new SecurityPage(page, 'tablet');
  await security.goto();
  await scrollPage(page);
  const buffer = await security.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/security/securityTabletFigma.png',
    actualPath: `${diffDir}/securityTablet-actual.png`,
    diffPath: `${diffDir}/securityTablet-diff.png`,
    expectedCopyPath: `${diffDir}/securityTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/securityTablet-report.html`,
    pageName: 'Security Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Security Mobile visual should match Figma', async ({ page }) => {
  const security = new SecurityPage(page, 'mobile');
  await security.goto();
  await scrollPage(page);
  const buffer = await security.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/security/securityMobileFigma.png',
    actualPath: `${diffDir}/securityMobile-actual.png`,
    diffPath: `${diffDir}/securityMobile-diff.png`,
    expectedCopyPath: `${diffDir}/securityMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/securityMobile-report.html`,
    pageName: 'Security Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined security multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/securityMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Security',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'securityDesktop-expected.png',
        actualImage: 'securityDesktop-actual.png',
        diffImage: 'securityDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'securityLaptop-expected.png',
        actualImage: 'securityLaptop-actual.png',
        diffImage: 'securityLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'securityTablet-expected.png',
        actualImage: 'securityTablet-actual.png',
        diffImage: 'securityTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'securityMobile-expected.png',
        actualImage: 'securityMobile-actual.png',
        diffImage: 'securityMobile-diff.png'
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
