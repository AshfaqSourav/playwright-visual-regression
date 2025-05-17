import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    headless: false, 
    // viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    trace: 'off',
    viewport: null , // 👈 Let window size control the viewport

    launchOptions: {
      args: [
        '--start-maximized' // 👈 Ask Chromium to open maximized
      ]
    }
    
  }
});
