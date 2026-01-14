import { test as base } from '@playwright/test';
import { BasePage } from '../pages';

type MyFixtures = {
    basePage: BasePage;
};

export const test = base.extend<MyFixtures>({
    basePage: async ({ page }, use) => {
        const basePage = new BasePage(page);
        await use(basePage);
    },
});

export { expect } from '@playwright/test';