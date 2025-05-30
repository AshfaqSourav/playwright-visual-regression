import { test, expect } from '@playwright/test';
import { FamilyPage } from '../../pages/staticPages/FamilyPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/family/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/family/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/family/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/family/mobile';
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

test('A - Family Desktop visual should match Figma', async ({ page }) => {
  const family = new FamilyPage(page, 'desktop');
  await family.goto();
  await scrollPage(page);
  const buffer = await family.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/family/familyDesktopFigma.png',
    actualPath: `${diffDir}/familyDesktop-actual.png`,
    diffPath: `${diffDir}/familyDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/familyDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/familyDesktop-report.html`,
    pageName: 'Family Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Family Laptop visual should match Figma', async ({ page }) => {
  const family = new FamilyPage(page, 'laptop');
  await family.goto();
  await scrollPage(page);
  const buffer = await family.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/family/familyLaptopFigma.png',
    actualPath: `${diffDir}/familyLaptop-actual.png`,
    diffPath: `${diffDir}/familyLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/familyLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/familyLaptop-report.html`,
    pageName: 'Family Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Family Tablet visual should match Figma', async ({ page }) => {
  const family = new FamilyPage(page, 'tablet');
  await family.goto();
  await scrollPage(page);
  const buffer = await family.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/family/familyTabletFigma.png',
    actualPath: `${diffDir}/familyTablet-actual.png`,
    diffPath: `${diffDir}/familyTablet-diff.png`,
    expectedCopyPath: `${diffDir}/familyTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/familyTablet-report.html`,
    pageName: 'Family Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Family Mobile visual should match Figma', async ({ page }) => {
  const family = new FamilyPage(page, 'mobile');
  await family.goto();
  await scrollPage(page);
  const buffer = await family.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/family/familyMobileFigma.png',
    actualPath: `${diffDir}/familyMobile-actual.png`,
    diffPath: `${diffDir}/familyMobile-diff.png`,
    expectedCopyPath: `${diffDir}/familyMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/familyMobile-report.html`,
    pageName: 'Family Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined family multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/familyMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Family',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'familyDesktop-expected.png',
        actualImage: 'familyDesktop-actual.png',
        diffImage: 'familyDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'familyLaptop-expected.png',
        actualImage: 'familyLaptop-actual.png',
        diffImage: 'familyLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'familyTablet-expected.png',
        actualImage: 'familyTablet-actual.png',
        diffImage: 'familyTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'familyMobile-expected.png',
        actualImage: 'familyMobile-actual.png',
        diffImage: 'familyMobile-diff.png'
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
