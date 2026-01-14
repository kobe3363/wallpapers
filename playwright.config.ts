import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { DesktopBrowsers, CIBrowsers } from './playwright.browsers';

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

const COMMON_USE: PlaywrightTestConfig['use'] = {
  baseURL: process.env.BASE_URL,
  trace: 'on-first-retry',
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  headless: !!process.env.CI,
  extraHTTPHeaders: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  },
};

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  outputDir: './test-results',
  timeout: 5 * 60 * 1000,
  globalTimeout: 30 * 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  maxFailures: undefined,
  quiet: false,
  reportSlowTests: null,
  preserveOutput: 'always',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? '50%' : '25%',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],],
  use: {
    ...COMMON_USE,
    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000,
  },
  projects: process.env.CI ? CIBrowsers : DesktopBrowsers,
});
