import { test as base } from '@playwright/test';
import { BasePage } from '../pages/base.page';

type MyFixtures = {
    basePage: BasePage;
};

export const test = base.extend<MyFixtures>({
    basePage: async ({ page }, use) => {
        const basePage = new BasePage(page);

        await page.addLocatorHandler(
            page.getByRole('button', { name: 'Reject Optional Cookies' }),
            async (overlay) => {
                console.log('Detected cookie banner during test execution - closing it.');
                await overlay.click();
                await overlay.waitFor({ state: 'hidden' });
            }
        );

        await use(basePage);
    },
});

export { expect } from '@playwright/test';