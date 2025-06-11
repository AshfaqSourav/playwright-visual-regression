import { test, expect } from '@playwright/test';
import { CareersPage } from '../../pages/aboutXsolla/CareersPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutXsolla/careers/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutXsolla/careers/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutXsolla/careers/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutXsolla/careers/mobile';
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

test('A - Careers Desktop visual should match Figma', async ({ page }) => {
  const careers = new CareersPage(page, 'desktop');
  await careers.goto();
  await scrollPage(page);
  const buffer = await careers.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/careers/careersDesktopFigma.png',
    actualPath: `${diffDir}/careersDesktop-actual.png`,
    diffPath: `${diffDir}/careersDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/careersDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/careersDesktop-report.html`,
    pageName: 'Careers Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Careers Laptop visual should match Figma', async ({ page }) => {
  const careers = new CareersPage(page, 'laptop');
  await careers.goto();
  await scrollPage(page);
  const buffer = await careers.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/careers/careersLaptopFigma.png',
    actualPath: `${diffDir}/careersLaptop-actual.png`,
    diffPath: `${diffDir}/careersLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/careersLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/careersLaptop-report.html`,
    pageName: 'Careers Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Careers Tablet visual should match Figma', async ({ page }) => {
  const careers = new CareersPage(page, 'tablet');
  await careers.goto();
  await scrollPage(page);
  const buffer = await careers.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/careers/careersTabletFigma.png',
    actualPath: `${diffDir}/careersTablet-actual.png`,
    diffPath: `${diffDir}/careersTablet-diff.png`,
    expectedCopyPath: `${diffDir}/careersTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/careersTablet-report.html`,
    pageName: 'Careers Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Careers Mobile visual should match Figma', async ({ page }) => {
  const careers = new CareersPage(page, 'mobile');
  await careers.goto();
  await scrollPage(page);
  const buffer = await careers.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/careers/careersMobileFigma.png',
    actualPath: `${diffDir}/careersMobile-actual.png`,
    diffPath: `${diffDir}/careersMobile-diff.png`,
    expectedCopyPath: `${diffDir}/careersMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/careersMobile-report.html`,
    pageName: 'Careers Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined careers multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/careersMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Careers',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'careersDesktop-expected.png',
        actualImage: 'careersDesktop-actual.png',
        diffImage: 'careersDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'careersLaptop-expected.png',
        actualImage: 'careersLaptop-actual.png',
        diffImage: 'careersLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'careersTablet-expected.png',
        actualImage: 'careersTablet-actual.png',
        diffImage: 'careersTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'careersMobile-expected.png',
        actualImage: 'careersMobile-actual.png',
        diffImage: 'careersMobile-diff.png'
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
