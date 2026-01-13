import { type Page, type Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly rejectCookiesBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rejectCookiesBtn = page.getByRole('button', { name: 'Reject Optional Cookies' });
    }

    /**
     * Naviguoja į nurodytą puslapį ir automatiškai sutvarko slapukus.
     * @param path URL kelias (pagal nutylėjimą '/').
     */
    async goto(path = '/') {
        await this.page.goto(path);
        await this.page.waitForLoadState('domcontentloaded');
        await this.handleInitialCookies();
    }

    private async handleInitialCookies() {
        try {
            await this.rejectCookiesBtn.waitFor({ state: 'visible', timeout: 3000 });
            console.log('Cookie banner detected on load. Closing...');
            await this.rejectCookiesBtn.click();
            await this.rejectCookiesBtn.waitFor({ state: 'hidden' , timeout: 2000 });
        } catch (error) {
            // Baneris nepasirodė – tai normalu (pvz., fixture jau sutvarkė arba sesija išsaugota).
            // Tęsiame darbą tyliai.
            // console.log('Cookie banner did not appear, continuing...');
        }
    }
}