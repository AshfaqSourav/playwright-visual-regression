import { test, expect } from '@playwright/test';
import { ContactUsPage } from '../../pages/staticPages/ContactUsPage';
import { compareScreenshots } from '../../utils/compareScreenshots';
import { generateHtmlReport as generateDesktopHtml } from '../../utils/HtmlReport/staticPages/contactUs/desktop';
import { generateHtmlReport as generateLaptopHtml } from '../../utils/HtmlReport/staticPages/contactUs/laptop';
import { generateHtmlReport as generateTabletHtml } from '../../utils/HtmlReport/staticPages/contactUs/tablet';
import { generateHtmlReport as generateMobileHtml } from '../../utils/HtmlReport/staticPages/contactUs/mobile';
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

test('A - Contact Us Desktop visual should match Figma', async ({ page }) => {
  const contactUs = new ContactUsPage(page, 'desktop');
  await contactUs.goto();
  await scrollPage(page);
  const buffer = await contactUs.takeScreenshot();

  desktopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/contactUs/contactUsDesktopFigma.png',
    actualPath: `${diffDir}/contactUsDesktop-actual.png`,
    diffPath: `${diffDir}/contactUsDesktop-diff.png`,
    expectedCopyPath: `${diffDir}/contactUsDesktop-expected.png`
  });

  generateDesktopHtml({
    diffPixels: desktopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/contactUsDesktop-report.html`,
    pageName: 'Contact Us Desktop'
  });

  expect(desktopDiffPixels).toBeLessThan(100);
});

test('B - Contact Us Laptop visual should match Figma', async ({ page }) => {
  const contactUs = new ContactUsPage(page, 'laptop');
  await contactUs.goto();
  await scrollPage(page);
  const buffer = await contactUs.takeScreenshot();

  laptopDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/contactUs/contactUsLaptopFigma.png',
    actualPath: `${diffDir}/contactUsLaptop-actual.png`,
    diffPath: `${diffDir}/contactUsLaptop-diff.png`,
    expectedCopyPath: `${diffDir}/contactUsLaptop-expected.png`
  });

  generateLaptopHtml({
    diffPixels: laptopDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/contactUsLaptop-report.html`,
    pageName: 'Contact Us Laptop'
  });

  expect(laptopDiffPixels).toBeLessThan(100);
});

test('C - Contact Us Tablet visual should match Figma', async ({ page }) => {
  const contactUs = new ContactUsPage(page, 'tablet');
  await contactUs.goto();
  await scrollPage(page);
  const buffer = await contactUs.takeScreenshot();

  tabletDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/contactUs/contactUsTabletFigma.png',
    actualPath: `${diffDir}/contactUsTablet-actual.png`,
    diffPath: `${diffDir}/contactUsTablet-diff.png`,
    expectedCopyPath: `${diffDir}/contactUsTablet-expected.png`
  });

  generateTabletHtml({
    diffPixels: tabletDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/contactUsTablet-report.html`,
    pageName: 'Contact Us Tablet'
  });

  expect(tabletDiffPixels).toBeLessThan(100);
});

test('D - Contact Us Mobile visual should match Figma', async ({ page }) => {
  const contactUs = new ContactUsPage(page, 'mobile');
  await contactUs.goto();
  await scrollPage(page);
  const buffer = await contactUs.takeScreenshot();

  mobileDiffPixels = compareScreenshots({
    actualBuffer: buffer,
    expectedPath: './expected_screenshots/contactUs/contactUsMobileFigma.png',
    actualPath: `${diffDir}/contactUsMobile-actual.png`,
    diffPath: `${diffDir}/contactUsMobile-diff.png`,
    expectedCopyPath: `${diffDir}/contactUsMobile-expected.png`
  });

  generateMobileHtml({
    diffPixels: mobileDiffPixels,
    outputDir: diffDir,
    reportPath: `${diffDir}/contactUsMobile-report.html`,
    pageName: 'Contact Us Mobile'
  });

  expect(mobileDiffPixels).toBeLessThan(100);
});

test('E - Generate combined contactUs multi-viewport tabbed report', async () => {
  const reportPath = path.resolve('./diff_output/contactUsMultiViewportReport.html');
  generateTabbedReportHtml({
    outputDir: diffDir,
    reportPath,
    pageName: 'Contact Us',
    viewports: [
      {
        name: 'Desktop',
        diffPixels: desktopDiffPixels,
        expectedImage: 'contactUsDesktop-expected.png',
        actualImage: 'contactUsDesktop-actual.png',
        diffImage: 'contactUsDesktop-diff.png'
      },
      {
        name: 'Laptop',
        diffPixels: laptopDiffPixels,
        expectedImage: 'contactUsLaptop-expected.png',
        actualImage: 'contactUsLaptop-actual.png',
        diffImage: 'contactUsLaptop-diff.png'
      },
      {
        name: 'Tablet',
        diffPixels: tabletDiffPixels,
        expectedImage: 'contactUsTablet-expected.png',
        actualImage: 'contactUsTablet-actual.png',
        diffImage: 'contactUsTablet-diff.png'
      },
      {
        name: 'Mobile',
        diffPixels: mobileDiffPixels,
        expectedImage: 'contactUsMobile-expected.png',
        actualImage: 'contactUsMobile-actual.png',
        diffImage: 'contactUsMobile-diff.png'
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
