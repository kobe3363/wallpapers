import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../pages';
import { type PriceFilter } from '../types/types';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

export class WallpapersPage extends BasePage {
    
    constructor(page: Page) {
        super(page);
    }

    async filterByPrice(priceType: PriceFilter) {
        const priceBtn = this.page.getByRole('button', { name: 'Price' });
        await priceBtn.click();

        const option = this.page.locator('div[role="option"]', { hasText: priceType });
        if (!(await option.isVisible())) {
             await priceBtn.click();
        }
        await option.click();
        await this.page.keyboard.press('Escape');

        await expect(this.page.getByRole('option', { name: priceType })).toBeHidden();
        await expect(this.page.getByRole('button', { name: priceType })).toBeVisible();
    }

    async downloadFirstWallpaper(keyword: string): Promise<string> {
        await this.page.getByRole('link', { name: keyword }).first().click();

        const downloadBtn = this.page.getByRole('button', { name: 'Download' });
        await expect(downloadBtn).toBeVisible();

        const downloadPromise = this.page.waitForEvent('download');
        await downloadBtn.click();

        const modal = this.page.locator('div[role="dialog"]').filter({ hasText: 'Preparing your download' });
        await expect(modal).toBeVisible();
        await expect(modal).toBeHidden({ timeout: 20 * 1000 });

        const download = await downloadPromise;
        const originalName = download.suggestedFilename();
        // Safari: need to sanitize filename to avoid issues with query params in names
        const sanitizedName = originalName.split('?')[0];
        const ext = path.extname(sanitizedName);
        const fileName = `${crypto.randomUUID()}${ext}`; 

        const downloadDir = 'downloads';
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        const savePath = path.join(downloadDir, fileName);
        await download.saveAs(savePath);

        return savePath;
    }
}
