import { test, expect } from '@playwright/test';
import { EcoPartnersPage } from '../../pages/aboutXsolla/EcoPartnersPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutXsolla/ecoPartners/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutXsolla/ecoPartners/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutXsolla/ecoPartners/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutXsolla/ecoPartners/mobile';
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

test('A - EcoPartners Desktop visual should match Figma', async ({ page }) => {
  const ecoPartners = new EcoPartnersPage(page, 'desktop');
  await ecoPartners.goto();
  await scrollPage(page);
  const buffer = await ecoPartners.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecoPartners/ecoPartnersDesktopFigma.png',
    actualPath: `${diffDir}/ecoPartnersDesktop-actual.png`,
    diffPath: `${diffDir}/ecoPartnersDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/ecoPartnersDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecoPartnersDesktop-report.html`,
    pageName: 'EcoPartners Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - EcoPartners Laptop visual should match Figma', async ({ page }) => {
  const ecoPartners = new EcoPartnersPage(page, 'laptop');
  await ecoPartners.goto();
  await scrollPage(page);
  const buffer = await ecoPartners.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecoPartners/ecoPartnersLaptopFigma.png',
    actualPath: `${diffDir}/ecoPartnersLaptop-actual.png`,
    diffPath: `${diffDir}/ecoPartnersLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/ecoPartnersLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecoPartnersLaptop-report.html`,
    pageName: 'EcoPartners Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - EcoPartners Tablet visual should match Figma', async ({ page }) => {
  const ecoPartners = new EcoPartnersPage(page, 'tablet');
  await ecoPartners.goto();
  await scrollPage(page);
  const buffer = await ecoPartners.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecoPartners/ecoPartnersTabletFigma.png',
    actualPath: `${diffDir}/ecoPartnersTablet-actual.png`,
    diffPath: `${diffDir}/ecoPartnersTablet-diff.png`,
    expectedCopyPath: `${diffDir}/ecoPartnersTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecoPartnersTablet-report.html`,
    pageName: 'EcoPartners Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - EcoPartners Mobile visual should match Figma', async ({ page }) => {
  const ecoPartners = new EcoPartnersPage(page, 'mobile');
  await ecoPartners.goto();
  await scrollPage(page);
  const buffer = await ecoPartners.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/ecoPartners/ecoPartnersMobileFigma.png',
    actualPath: `${diffDir}/ecoPartnersMobile-actual.png`,
    diffPath: `${diffDir}/ecoPartnersMobile-diff.png`,
    expectedCopyPath: `${diffDir}/ecoPartnersMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/ecoPartnersMobile-report.html`,
    pageName: 'EcoPartners Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined ecoPartners multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/ecoPartnersMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'EcoPartners',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'ecoPartnersDesktop-expected.png',
        actualImage: 'ecoPartnersDesktop-actual.png',
        diffImage: 'ecoPartnersDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'ecoPartnersLaptop-expected.png',
        actualImage: 'ecoPartnersLaptop-actual.png',
        diffImage: 'ecoPartnersLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'ecoPartnersTablet-expected.png',
        actualImage: 'ecoPartnersTablet-actual.png',
        diffImage: 'ecoPartnersTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'ecoPartnersMobile-expected.png',
        actualImage: 'ecoPartnersMobile-actual.png',
        diffImage: 'ecoPartnersMobile-diff.png'
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
