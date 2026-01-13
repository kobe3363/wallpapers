import { expect, Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    /**
     * Navigate to a path. Accepts absolute URLs or relative paths (relative to baseURL in config).
     */
    async goto(path = '/') {
        await this.page.goto(path);
        await this.page.waitForLoadState('load');
    }

    //TODO: Remove to beforeEach using await this.page.addLocatorHandler
    async acceptCookies() {
        const btn = this.page.getByRole('button', { name: 'Reject Optional Cookies' });

        await expect.poll(async () => {
            if (await btn.isVisible()) {
                await btn.click();
            }
            return await btn.isVisible();
        }, {
            message: 'Bandome uždaryti slapukus kol mygtukas dings',
            timeout: 5000,
            intervals: [250, 500, 1000]
        }).toBe(false);
    }
}
