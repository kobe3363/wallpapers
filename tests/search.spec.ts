import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { RingtonesAndWallpapersPage } from '../pages/ringtones-and-wallpapers.page';
import { WallpapersPage } from '../pages/wallpapers.page';

test('test', async ({ page }) => {
    // searching for wallpapers by keyword.
    const basePage = new BasePage(page);
    console.log('Testo matomas BASE_URL:', process.env.BASE_URL); // Jei čia undefined -> bėda su dotenv
    await basePage.goto('/');
    await basePage.acceptCookies();

    await page.getByRole('link', { name: 'Browse Now' }).click();
    await page.getByRole('navigation').getByRole('button', { name: 'All' }).click();
    await page.getByLabel('All').getByText('Wallpapers', { exact: true }).click();
    await page.getByRole('navigation').getByRole('textbox', { name: 'Search ' + process.env.COMPANY_NAME }).click();
    await page.getByRole('navigation').getByRole('textbox', { name: 'Search ' + process.env.COMPANY_NAME }).fill('sunrise');
    // identifying free vs premium
    await page.getByRole('navigation').getByRole('button', { name: 'Search' }).click();
    await page.getByRole('button', { name: 'Price' }).click();
    // downloading free wallpaper
    await page.locator('.Checkbox_input__ZoALC').first().click();
    await expect(page.getByRole('button', { name: 'Free' })).toBeVisible();
    await page.getByRole('link', { name: 'sunrise' }).first().click();
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
    await page.getByRole('button', { name: 'Download' }).click();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await page.getByText('14').click();
    // We should verify that the wallpaper item was successfully downloaded as a final step.
    const downloadPromise = page.waitForEvent('download');
    await page.goto(process.env.BASE_URL + '/wallpapers/0f377020-bbc0-47fb-ac5a-ade2429217ac');
    const download = await downloadPromise;
});