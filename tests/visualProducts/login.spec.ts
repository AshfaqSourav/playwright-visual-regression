import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/products/LoginPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/products/login/loginDesktopReport';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/products/login/loginLaptopReport';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/products/login/loginTabletReport';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/products/login/loginMobileReport';
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

test('A - Login Desktop visual should match Figma', async ({ page }) => {
  const login = new LoginPage(page, 'desktop');
  await login.goto();
  await scrollPage(page);
  const buffer = await login.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/login/loginDesktopFigma.png',
    actualPath: `${diffDir}/loginDesktop-actual.png`,
    diffPath: `${diffDir}/loginDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/loginDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/loginDesktop-report.html`,
    pageName: 'Login Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Login Laptop visual should match Figma', async ({ page }) => {
  const login = new LoginPage(page, 'laptop');
  await login.goto();
  await scrollPage(page);
  const buffer = await login.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/login/loginLaptopFigma.png',
    actualPath: `${diffDir}/loginLaptop-actual.png`,
    diffPath: `${diffDir}/loginLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/loginLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/loginLaptop-report.html`,
    pageName: 'Login Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Login Tablet visual should match Figma', async ({ page }) => {
  const login = new LoginPage(page, 'tablet');
  await login.goto();
  await scrollPage(page);
  const buffer = await login.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/login/loginTabletFigma.png',
    actualPath: `${diffDir}/loginTablet-actual.png`,
    diffPath: `${diffDir}/loginTablet-diff.png`,
    expectedCopyPath: `${diffDir}/loginTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/loginTablet-report.html`,
    pageName: 'Login Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Login Mobile visual should match Figma', async ({ page }) => {
  const login = new LoginPage(page, 'mobile');
  await login.goto();
  await scrollPage(page);
  const buffer = await login.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/login/loginMobileFigma.png',
    actualPath: `${diffDir}/loginMobile-actual.png`,
    diffPath: `${diffDir}/loginMobile-diff.png`,
    expectedCopyPath: `${diffDir}/loginMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/loginMobile-report.html`,
    pageName: 'Login Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined login multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/loginMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Login',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'loginDesktop-expected.png',
        actualImage: 'loginDesktop-actual.png',
        diffImage: 'loginDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'loginLaptop-expected.png',
        actualImage: 'loginLaptop-actual.png',
        diffImage: 'loginLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'loginTablet-expected.png',
        actualImage: 'loginTablet-actual.png',
        diffImage: 'loginTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'loginMobile-expected.png',
        actualImage: 'loginMobile-actual.png',
        diffImage: 'loginMobile-diff.png'
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
