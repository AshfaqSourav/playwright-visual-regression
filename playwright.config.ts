import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./utils/global-setup'),
  workers: 3,
  testDir: './tests',
  timeout: 120000,
  // reporter: 'html',
  use: {
    headless: false, 
    navigationTimeout: 120000, // ⏳ Timeout for navigation actions like page.goto()
    actionTimeout: 30000, 
    screenshot: 'only-on-failure',
    trace: 'off',
    viewport: null , // 👈 Let window size control the viewport
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: [
        //Cors Error Fix
    //     '--disable-web-security',
    // '--disable-features=IsolateOrigins,site-per-process',
    // '--allow-running-insecure-content',
    // '--disable-site-isolation-trials',
    '--start-maximized',// 👈 Ask Chromium to open maximized
    // '--ignore-certificate-errors',
    // '--unsafely-treat-insecure-origin-as-secure=https://strapi-frontend-stage-2025-06-12-v1.nl-k8s-stage.srv.local'
      ]
    }
    
  }
});
