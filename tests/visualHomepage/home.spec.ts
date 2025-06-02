import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home/HomePage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/home/homePage/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/home/homePage/laptop';
// import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/home/homePage/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/home/homePage/mobile';
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

test('A - Home Page Desktop visual should match Figma', async ({ page }) => {
  const home = new HomePage(page, 'desktop');
  await home.goto();
  await scrollPage(page);
  const buffer = await home.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/home/homeDesktopFigma.png',
    actualPath: `${diffDir}/homeDesktop-actual.png`,
    diffPath: `${diffDir}/homeDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/homeDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/homeDesktop-report.html`,
    pageName: 'Home Page Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Home Page Laptop visual should match Figma', async ({ page }) => {
  const home = new HomePage(page, 'laptop');
  await home.goto();
  await scrollPage(page);
  const buffer = await home.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/home/homeLaptopFigma.png',
    actualPath: `${diffDir}/homeLaptop-actual.png`,
    diffPath: `${diffDir}/homeLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/homeLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/homeLaptop-report.html`,
    pageName: 'Home Page Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

// test('C - Home Page Tablet visual should match Figma', async ({ page }) => {
//   const home = new HomePage(page, 'tablet');
//   await home.goto();
//   await scrollPage(page);
//   const buffer = await home.takeScreenshot();

//   tabletDiffPixels = compareScreenshots({
//     actualBuffer: buffer,
//     expectedPath: './expected_screenshots/home/homeTabletFigma.png',
//     actualPath: `${diffDir}/homeTablet-actual.png`,
//     diffPath: `${diffDir}/homeTablet-diff.png`,
//     expectedCopyPath: `${diffDir}/homeTablet-expected.png`
//   });

//   generateTabletHtml({
//     diffPixels: tabletDiffPixels,
//     outputDir: diffDir,
//     reportPath: `${diffDir}/homeTablet-report.html`,
//     pageName: 'Home Page Tablet'
//   });

//   expect(tabletDiffPixels).toBeLessThan(100);
// });

test('D - Home Page Mobile visual should match Figma', async ({ page }) => {
  const home = new HomePage(page, 'mobile');
  await home.goto();
  await scrollPage(page);
  const buffer = await home.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/home/homeMobileFigma.png',
    actualPath: `${diffDir}/homeMobile-actual.png`,
    diffPath: `${diffDir}/homeMobile-diff.png`,
    expectedCopyPath: `${diffDir}/homeMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/homeMobile-report.html`,
    pageName: 'Home Page Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined home multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/homeMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Home Page',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'homeDesktop-expected.png',
        actualImage: 'homeDesktop-actual.png',
        diffImage: 'homeDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'homeLaptop-expected.png',
        actualImage: 'homeLaptop-actual.png',
        diffImage: 'homeLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'homeTablet-expected.png',
        actualImage: 'homeTablet-actual.png',
        diffImage: 'homeTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'homeMobile-expected.png',
        actualImage: 'homeMobile-actual.png',
        diffImage: 'homeMobile-diff.png'
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
