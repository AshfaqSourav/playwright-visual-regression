import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./utils/global-setup'),
  workers: 3,
  testDir: './tests',
  // reporter: 'html',
  use: {
    headless: false, 
    screenshot: 'only-on-failure',
    trace: 'off',
    viewport: null , // 👈 Let window size control the viewport

    launchOptions: {
      args: [
        '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--allow-running-insecure-content',
    '--disable-site-isolation-trials',
    '--start-maximized'// 👈 Ask Chromium to open maximized
      ]
    }
    
  }
});
