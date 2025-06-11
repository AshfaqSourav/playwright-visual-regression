import { test, expect } from '@playwright/test';
import { LauncherPage } from '../../pages/XpsLandingPages/LauncherPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/xpsLandingPages/launcher/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/xpsLandingPages/launcher/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/xpsLandingPages/launcher/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/xpsLandingPages/launcher/mobile';
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

test('A - launcher Desktop visual should match Figma', async ({ page }) => {
  const launcher = new LauncherPage(page, 'desktop');
  await launcher.goto();
  await scrollPage(page);
  const buffer = await launcher.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/launcher/launcherDesktopFigma.png',
    actualPath: `${diffDir}/launcherDesktop-actual.png`,
    diffPath: `${diffDir}/launcherDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/launcherDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/launcherDesktop-report.html`,
    pageName: 'launcher Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - launcher Laptop visual should match Figma', async ({ page }) => {
  const launcher = new LauncherPage(page, 'laptop');
  await launcher.goto();
  await scrollPage(page);
  const buffer = await launcher.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/launcher/launcherLaptopFigma.png',
    actualPath: `${diffDir}/launcherLaptop-actual.png`,
    diffPath: `${diffDir}/launcherLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/launcherLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/launcherLaptop-report.html`,
    pageName: 'launcher Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - launcher Tablet visual should match Figma', async ({ page }) => {
  const launcher = new LauncherPage(page, 'tablet');
  await launcher.goto();
  await scrollPage(page);
  const buffer = await launcher.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/launcher/launcherTabletFigma.png',
    actualPath: `${diffDir}/launcherTablet-actual.png`,
    diffPath: `${diffDir}/launcherTablet-diff.png`,
    expectedCopyPath: `${diffDir}/launcherTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/launcherTablet-report.html`,
    pageName: 'launcher Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - launcher Mobile visual should match Figma', async ({ page }) => {
  const launcher = new LauncherPage(page, 'mobile');
  await launcher.goto();
  await scrollPage(page);
  const buffer = await launcher.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/launcher/launcherMobileFigma.png',
    actualPath: `${diffDir}/launcherMobile-actual.png`,
    diffPath: `${diffDir}/launcherMobile-diff.png`,
    expectedCopyPath: `${diffDir}/launcherMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/launcherMobile-report.html`,
    pageName: 'launcher Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined launcher multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/launcherMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'launcher',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'launcherDesktop-expected.png',
        actualImage: 'launcherDesktop-actual.png',
        diffImage: 'launcherDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'launcherLaptop-expected.png',
        actualImage: 'launcherLaptop-actual.png',
        diffImage: 'launcherLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'launcherTablet-expected.png',
        actualImage: 'launcherTablet-actual.png',
        diffImage: 'launcherTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'launcherMobile-expected.png',
        actualImage: 'launcherMobile-actual.png',
        diffImage: 'launcherMobile-diff.png'
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
