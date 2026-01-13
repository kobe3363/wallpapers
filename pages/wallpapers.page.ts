import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import path from 'path';
import crypto from 'crypto';

export class WallpapersPage extends BasePage {
    
    constructor(page: Page) {
        super(page);
    }

    async filterByPrice(priceType: 'Free' | 'Premium') {
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
        await downloadBtn.click();

        const downloadPromise = this.page.waitForEvent('download');

        const modal = this.page.locator('div[role="dialog"]').filter({ hasText: 'Preparing your download' });
        await expect(modal).toBeVisible();
        await expect(modal).toBeHidden({ timeout: 20000 });

        const download = await downloadPromise;
        const originalName = download.suggestedFilename();
        const ext = path.extname(originalName);
        const fileName = `${crypto.randomUUID()}${ext}`; 
        const savePath = path.join('downloads', fileName);
        await download.saveAs(savePath);

        return savePath;
    }
}
