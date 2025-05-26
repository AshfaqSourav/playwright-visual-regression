// /tests/specs/payments.spec.ts

import { test, expect } from '@playwright/test';
import { PaymentsPage } from '../../pages/solutions/PaymentsPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/solutions/slnPayments/laptop';
import { generateHtmlReport as generateTabbedReportHtml } from '../../utils/HtmlReport/generateTabbedReport';
import { scrollPage } from '../../utils/scrollUtils';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const diffDir = './diff_output';
let laptopDiffPixels = 0;



// Laptop Test
test('A - Solution Payments Laptop visual should match Figma', async ({ page }) => {
  const paymentsPage = new PaymentsPage(page, 'laptop');
  await paymentsPage.goto();
  await scrollPage(page);
  const buffer = await paymentsPage.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/slnPayments/slnPaymentsLaptopFigma.png',
    actualPath: `${diffDir}/slnPaymentsLaptop-actual.png`,
    diffPath: `${diffDir}/slnPaymentsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/slnPaymentsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/slnPaymentsLaptop-report.html`,
    pageName: 'Solution Payments Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});


// Combined Report
test('B - Generate combined solution Payments multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/slnPaymentsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Solution Payments',
    viewports: [
   
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'slnPaymentsLaptop-expected.png',
        actualImage: 'slnPaymentsLaptop-actual.png',
        diffImage: 'slnPaymentsLaptop-diff.png'
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
