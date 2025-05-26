// /tests/visualSolutions/solutions.spec.ts

import { test, expect } from '@playwright/test';
import { SolutionsPage } from '../../pages/solutions/SolutionsPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/solutions/solutions/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/solutions/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/solutions/solutions/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/solutions/solutions/mobile';
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

test('A - Solutions Desktop visual should match Figma', async ({ page }) => {
  const solutions = new SolutionsPage(page, 'desktop');
  await solutions.goto();
  await scrollPage(page);
  const buffer = await solutions.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/solutions/solutionsDesktopFigma.png',
    actualPath: `${diffDir}/solutionsDesktop-actual.png`,
    diffPath: `${diffDir}/solutionsDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/solutionsDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/solutionsDesktop-report.html`,
    pageName: 'Solutions Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Solutions Laptop visual should match Figma', async ({ page }) => {
  const solutions = new SolutionsPage(page, 'laptop');
  await solutions.goto();
  await scrollPage(page);
  const buffer = await solutions.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/solutions/solutionsLaptopFigma.png',
    actualPath: `${diffDir}/solutionsLaptop-actual.png`,
    diffPath: `${diffDir}/solutionsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/solutionsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/solutionsLaptop-report.html`,
    pageName: 'Solutions Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Solutions Tablet visual should match Figma', async ({ page }) => {
  const solutions = new SolutionsPage(page, 'tablet');
  await solutions.goto();
  await scrollPage(page);
  const buffer = await solutions.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/solutions/solutionsTabletFigma.png',
    actualPath: `${diffDir}/solutionsTablet-actual.png`,
    diffPath: `${diffDir}/solutionsTablet-diff.png`,
    expectedCopyPath: `${diffDir}/solutionsTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/solutionsTablet-report.html`,
    pageName: 'Solutions Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Solutions Mobile visual should match Figma', async ({ page }) => {
  const solutions = new SolutionsPage(page, 'mobile');
  await solutions.goto();
  await scrollPage(page);
  const buffer = await solutions.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/solutions/solutionsMobileFigma.png',
    actualPath: `${diffDir}/solutionsMobile-actual.png`,
    diffPath: `${diffDir}/solutionsMobile-diff.png`,
    expectedCopyPath: `${diffDir}/solutionsMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/solutionsMobile-report.html`,
    pageName: 'Solutions Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined solutions multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/solutionsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Solutions',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'solutionsDesktop-expected.png',
        actualImage: 'solutionsDesktop-actual.png',
        diffImage: 'solutionsDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'solutionsLaptop-expected.png',
        actualImage: 'solutionsLaptop-actual.png',
        diffImage: 'solutionsLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'solutionsTablet-expected.png',
        actualImage: 'solutionsTablet-actual.png',
        diffImage: 'solutionsTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'solutionsMobile-expected.png',
        actualImage: 'solutionsMobile-actual.png',
        diffImage: 'solutionsMobile-diff.png'
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
