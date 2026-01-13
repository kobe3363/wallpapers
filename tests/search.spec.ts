import { test, expect } from '../fixtures/test-setup';
import { RingtonesAndWallpapersPage } from '../pages/ringtones-and-wallpapers.page';
import { WallpapersPage } from '../pages/wallpapers.page';
import path from 'path';
import crypto from 'crypto';

test('test', async ({ basePage, page }) => {
    // searching for wallpapers by keyword.
    await basePage.goto('/ringtones-and-wallpapers');

    const navBar = page.getByRole('navigation');
    await navBar.getByRole('button', { name: 'All' }).first().click();
    // Jei meniu netyčia užsidarė (dėl animacijų), patikriname ir bandome dar kartą
    const wallpapersOption = page.getByRole('menuitemradio', { name: 'Wallpapers' });
    if (!(await wallpapersOption.isVisible())) {
         await navBar.getByRole('button', { name: 'All' }).first().click();
    }
    await wallpapersOption.click();
    await expect(navBar.getByRole('button', { name: 'Wallpapers' })).toBeVisible();

    await page.getByRole('navigation').getByRole('textbox', { name: 'Search ' + process.env.COMPANY_NAME }).click();
    await page.getByRole('navigation').getByRole('textbox', { name: 'Search ' + process.env.COMPANY_NAME }).fill('sunrise');
    await page.getByRole('navigation').getByRole('button', { name: 'Search' }).click();
    // identifying free vs premium
    await page.getByRole('button', { name: 'Price' }).click();
    await page.locator('div[role="option"]', { hasText: 'Free' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('option', { name: 'Free' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Free' })).toBeVisible();
    // downloading free wallpaper
    await page.getByRole('link', { name: 'sunrise' }).first().click();
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
    await page.getByRole('button', { name: 'Download' }).click();

    const downloadPromise = page.waitForEvent('download');
    const modal = page.locator('div[role="dialog"]').filter({ hasText: 'Preparing your download' });
    await expect(modal).toBeVisible();
    await expect(modal).toBeHidden({ timeout: 20000 });
    // We should verify that the wallpaper item was successfully downloaded as a final step.
    const download = await downloadPromise;
    const originalName = download.suggestedFilename();
    const ext = path.extname(originalName);
    const fileName = `${crypto.randomUUID()}${ext}`; 
    await download.saveAs(path.join('downloads', fileName));
    expect(await download.path()).toBeTruthy();
});