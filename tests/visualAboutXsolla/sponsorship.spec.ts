import { test, expect } from '@playwright/test';
import { SponsorshipPage } from '../../pages/aboutXsolla/SponsorshipPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/aboutXsolla/sponsorship/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/aboutXsolla/sponsorship/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/aboutXsolla/sponsorship/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/aboutXsolla/sponsorship/mobile';
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

test('A - Sponsorship Desktop visual should match Figma', async ({ page }) => {
  const sponsorship = new SponsorshipPage(page, 'desktop');
  await sponsorship.goto();
  await scrollPage(page);
  const buffer = await sponsorship.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sponsorship/sponsorshipDesktopFigma.png',
    actualPath: `${diffDir}/sponsorshipDesktop-actual.png`,
    diffPath: `${diffDir}/sponsorshipDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/sponsorshipDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sponsorshipDesktop-report.html`,
    pageName: 'Sponsorship Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Sponsorship Laptop visual should match Figma', async ({ page }) => {
  const sponsorship = new SponsorshipPage(page, 'laptop');
  await sponsorship.goto();
  await scrollPage(page);
  const buffer = await sponsorship.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sponsorship/sponsorshipLaptopFigma.png',
    actualPath: `${diffDir}/sponsorshipLaptop-actual.png`,
    diffPath: `${diffDir}/sponsorshipLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/sponsorshipLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sponsorshipLaptop-report.html`,
    pageName: 'Sponsorship Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Sponsorship Tablet visual should match Figma', async ({ page }) => {
  const sponsorship = new SponsorshipPage(page, 'tablet');
  await sponsorship.goto();
  await scrollPage(page);
  const buffer = await sponsorship.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sponsorship/sponsorshipTabletFigma.png',
    actualPath: `${diffDir}/sponsorshipTablet-actual.png`,
    diffPath: `${diffDir}/sponsorshipTablet-diff.png`,
    expectedCopyPath: `${diffDir}/sponsorshipTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sponsorshipTablet-report.html`,
    pageName: 'Sponsorship Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Sponsorship Mobile visual should match Figma', async ({ page }) => {
  const sponsorship = new SponsorshipPage(page, 'mobile');
  await sponsorship.goto();
  await scrollPage(page);
  const buffer = await sponsorship.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/sponsorship/sponsorshipMobileFigma.png',
    actualPath: `${diffDir}/sponsorshipMobile-actual.png`,
    diffPath: `${diffDir}/sponsorshipMobile-diff.png`,
    expectedCopyPath: `${diffDir}/sponsorshipMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/sponsorshipMobile-report.html`,
    pageName: 'Sponsorship Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined sponsorship multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/sponsorshipMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Sponsorship',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'sponsorshipDesktop-expected.png',
        actualImage: 'sponsorshipDesktop-actual.png',
        diffImage: 'sponsorshipDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'sponsorshipLaptop-expected.png',
        actualImage: 'sponsorshipLaptop-actual.png',
        diffImage: 'sponsorshipLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'sponsorshipTablet-expected.png',
        actualImage: 'sponsorshipTablet-actual.png',
        diffImage: 'sponsorshipTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'sponsorshipMobile-expected.png',
        actualImage: 'sponsorshipMobile-actual.png',
        diffImage: 'sponsorshipMobile-diff.png'
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
