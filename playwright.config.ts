import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 5 * 60 * 1000,
  globalTimeout: 10 * 60 * 1000,
  maxFailures: 5,
  quiet: false,
  reportSlowTests: null,
  preserveOutput: 'always',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? '50%' : '25%',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],  ],
  use: {
    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000,
    baseURL: process.env.BASE_URL,
    trace: 'on',
    video: 'on',
    screenshot: 'on',
    headless: !!process.env.CI,
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: './test-results',
});
