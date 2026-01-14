import { type Page, type Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly rejectCookiesBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rejectCookiesBtn = page.getByRole('button', { name: 'Reject Optional Cookies' });
    }

    async goto(path = '/') {
        await this.page.goto(path);
        await this.page.waitForLoadState('domcontentloaded');
        await this.handleInitialCookies();
    }

    private async handleInitialCookies() {
        try {
            await this.rejectCookiesBtn.waitFor({ state: 'visible', timeout: 3000 });
            console.log('Base page detected cookie banner during test execution - closing it.');
            await this.rejectCookiesBtn.click();
            await this.rejectCookiesBtn.waitFor({ state: 'hidden' , timeout: 2000 });
        } catch (error) {
            console.debug('Unsuccessful cookie banner handling. Check logs');
        }
    }
}