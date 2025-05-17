import { test, expect } from '@playwright/test';
import { PaystationPage } from '../../pages/PaystationPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/generatePaystationDesktopHtmlReport';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/generatePaystationLaptopHtmlReport';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/generatePaystationTabletHtmlReport';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/generatePaystationMobileHtmlReport';
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

// Desktop Test
test('Paystation Desktop visual should match Figma', async ({ page }) => {
  const paystation = new PaystationPage(page, 'desktop');
  await paystation.goto();
  await scrollPage(page);
  const buffer = await paystation.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/paystation/paystationDesktopFigma.png',
    actualPath: `${diffDir}/paystationDesktop-actual.png`,
    diffPath: `${diffDir}/paystationDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/paystationDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/paystationDesktop-report.html`,
    pageName: 'Paystation Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

// Laptop Test
test('Paystation Laptop visual should match Figma', async ({ page }) => {
  const paystation = new PaystationPage(page, 'laptop');
  await paystation.goto();
  await scrollPage(page);
  const buffer = await paystation.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/paystation/paystationLaptopFigma.png',
    actualPath: `${diffDir}/paystationLaptop-actual.png`,
    diffPath: `${diffDir}/paystationLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/paystationLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/paystationLaptop-report.html`,
    pageName: 'Paystation Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

// Tablet Test
test('Paystation Tablet visual should match Figma', async ({ page }) => {
  const paystation = new PaystationPage(page, 'tablet');
  await paystation.goto();
  await scrollPage(page);
  const buffer = await paystation.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/paystation/paystationTabletFigma.png',
    actualPath: `${diffDir}/paystationTablet-actual.png`,
    diffPath: `${diffDir}/paystationTablet-diff.png`,
    expectedCopyPath: `${diffDir}/paystationTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/paystationTablet-report.html`,
    pageName: 'Paystation Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

// Mobile Test
test('Paystation Mobile visual should match Figma', async ({ page }) => {
  const paystation = new PaystationPage(page, 'mobile');
  await paystation.goto();
  await scrollPage(page);
  const buffer = await paystation.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/paystation/paystationMobileFigma.png',
    actualPath: `${diffDir}/paystationMobile-actual.png`,
    diffPath: `${diffDir}/paystationMobile-diff.png`,
    expectedCopyPath: `${diffDir}/paystationMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/paystationMobile-report.html`,
    pageName: 'Paystation Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

// Combined Report
test('Generate combined multi-viewport tabbed report', async () => {
   const reportPath = path.resolve('./diff_output/multiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath: `${diffDir}/multiViewportReport.html`,
    pageName: 'Paystation',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'paystation-expected.png',
        actualImage: 'paystation-actual.png',
        diffImage: 'paystation-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'paystationLaptop-expected.png',
        actualImage: 'paystationLaptop-actual.png',
        diffImage: 'paystationLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'paystationTablet-expected.png',
        actualImage: 'paystationTablet-actual.png',
        diffImage: 'paystationTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'paystationMobile-expected.png',
        actualImage: 'paystationMobile-actual.png',
        diffImage: 'paystationMobile-diff.png'
      }
    ]
  });
    // ✅ Try to open it silently (only if file exists)
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
          if (err) {
            console.warn('⚠️ Failed to open browser:', err.message);
          } else {
            console.log('✅ Opened visual report in browser');
          }
          resolve(true);
        });
      });
    }
    }
  });

