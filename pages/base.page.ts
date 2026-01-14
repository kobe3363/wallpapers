import { type Page, type Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly didomiHost: Locator;
    readonly rejectCookiesBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.didomiHost = page.getByTestId('notice');
        this.rejectCookiesBtn = page.getByRole('button', { name: /Reject Optional Cookies/i });
    }

    async goto(path = '/') {
        await this.page.goto(path);
        await this.page.waitForLoadState('networkidle');
        await this.handleInitialCookies();
    }

    private async handleInitialCookies() {
        try {
            await this.didomiHost.first().waitFor({ state: 'visible', timeout: 10000 });
            await this.rejectCookiesBtn.click();
            await this.didomiHost.first().waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
            throw new Error('Cookie banner was visible but could not be dismissed', { cause: error as Error });
        }
    }
}