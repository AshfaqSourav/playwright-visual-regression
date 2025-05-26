// /tests/visualSolutions/xsollaGold.spec.ts

import { test, expect } from '@playwright/test';
import { XsollaGoldPage } from '../../pages/solutions/XsollaGoldPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/solutions/xsollaGold/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/xsollaGold/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/solutions/xsollaGold/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/solutions/xsollaGold/mobile';
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

test('A - XsollaGold Desktop visual should match Figma', async ({ page }) => {
  const slnXsollaGold = new XsollaGoldPage(page, 'desktop');
  await slnXsollaGold.goto();
  await scrollPage(page);
  const buffer = await slnXsollaGold.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXsollaGold/slnXsollaGoldDesktopFigma.png',
    actualPath: `${diffDir}/slnXsollaGoldDesktop-actual.png`,
    diffPath: `${diffDir}/slnXsollaGoldDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/slnXsollaGoldDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXsollaGoldDesktop-report.html`,
    pageName: 'XsollaGold Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - XsollaGold Laptop visual should match Figma', async ({ page }) => {
  const slnXsollaGold = new XsollaGoldPage(page, 'laptop');
  await slnXsollaGold.goto();
  await scrollPage(page);
  const buffer = await slnXsollaGold.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXsollaGold/slnXsollaGoldLaptopFigma.png',
    actualPath: `${diffDir}/slnXsollaGoldLaptop-actual.png`,
    diffPath: `${diffDir}/slnXsollaGoldLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/slnXsollaGoldLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXsollaGoldLaptop-report.html`,
    pageName: 'XsollaGold Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - XsollaGold Tablet visual should match Figma', async ({ page }) => {
  const slnXsollaGold = new XsollaGoldPage(page, 'tablet');
  await slnXsollaGold.goto();
  await scrollPage(page);
  const buffer = await slnXsollaGold.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXsollaGold/slnXsollaGoldTabletFigma.png',
    actualPath: `${diffDir}/slnXsollaGoldTablet-actual.png`,
    diffPath: `${diffDir}/slnXsollaGoldTablet-diff.png`,
    expectedCopyPath: `${diffDir}/slnXsollaGoldTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXsollaGoldTablet-report.html`,
    pageName: 'XsollaGold Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - XsollaGold Mobile visual should match Figma', async ({ page }) => {
  const slnXsollaGold = new XsollaGoldPage(page, 'mobile');
  await slnXsollaGold.goto();
  await scrollPage(page);
  const buffer = await slnXsollaGold.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnXsollaGold/slnXsollaGoldMobileFigma.png',
    actualPath: `${diffDir}/slnXsollaGoldMobile-actual.png`,
    diffPath: `${diffDir}/slnXsollaGoldMobile-diff.png`,
    expectedCopyPath: `${diffDir}/slnXsollaGoldMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnXsollaGoldMobile-report.html`,
    pageName: 'XsollaGold Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined XsollaGold multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/slnXsollaGoldMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'XsollaGold',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'slnXsollaGoldDesktop-expected.png',
        actualImage: 'slnXsollaGoldDesktop-actual.png',
        diffImage: 'slnXsollaGoldDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'slnXsollaGoldLaptop-expected.png',
        actualImage: 'slnXsollaGoldLaptop-actual.png',
        diffImage: 'slnXsollaGoldLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'slnXsollaGoldTablet-expected.png',
        actualImage: 'slnXsollaGoldTablet-actual.png',
        diffImage: 'slnXsollaGoldTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'slnXsollaGoldMobile-expected.png',
        actualImage: 'slnXsollaGoldMobile-actual.png',
        diffImage: 'slnXsollaGoldMobile-diff.png'
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

    await new Promise((resolve) => {
      exec(openCommand, (err) => {
        if (err) console.warn('⚠️ Failed to open browser:', err.message);
        else console.log('✅ Opened visual report in browser');
        resolve(true);
      });
    });
  }
});
