import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./utils/global-setup'),
  workers: 3,
  testDir: './tests',
  timeout: 120000,
  // reporter: 'html',
  use: {
    headless: false, 
    navigationTimeout: 60000, // ⏳ Timeout for navigation actions like page.goto()
    actionTimeout: 30000, 
    screenshot: 'only-on-failure',
    trace: 'off',
    viewport: null , // 👈 Let window size control the viewport

    launchOptions: {
      args: [
        //Cors Error Fix
    //     '--disable-web-security',
    // '--disable-features=IsolateOrigins,site-per-process',
    // '--allow-running-insecure-content',
    // '--disable-site-isolation-trials',
    '--start-maximized'// 👈 Ask Chromium to open maximized
      ]
    }
    
  }
});
