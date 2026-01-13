import { Page } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) { }

    /**
     * Navigate to a path. Accepts absolute URLs or relative paths (relative to baseURL in config).
     */
    async goto(path = '/') {
        await this.page.goto(path);
        await this.page.waitForLoadState('load');
    }
}
