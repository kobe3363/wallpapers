import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from '../pages';
import { type Category } from '../types/types';

export class RingtonesAndWallpapersPage extends BasePage {
    readonly navBar: Locator;
    readonly categoryTrigger: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        super(page);

        this.navBar = page.getByRole('navigation');
        this.categoryTrigger = this.navBar.locator('button[class*="DropdownChip"]');
        const placeholder = 'Search ' + (process.env.COMPANY_NAME);
        this.searchInput = this.navBar.getByRole('textbox', { name: placeholder });
        this.searchButton = this.navBar.getByRole('button', { name: 'Search' });
    }

    async selectCategory(categoryName: Category) {
        const optionToSelect = this.page.getByRole('menuitemradio', { name: categoryName });

        await expect(async () => {
            if (!(await optionToSelect.isVisible())) {
                await this.categoryTrigger.click({ force: true });
            }

            await expect(optionToSelect).toBeVisible({ timeout: 1000 });
        }).toPass({
            timeout: 10000,
            intervals: [500],
        });

        await optionToSelect.click({ force: true });
        await expect(this.categoryTrigger).toHaveText(categoryName);
    }

    async searchFor(keyword: string) {
        await this.searchInput.click();
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
        await expect(this.page).toHaveURL(new RegExp(keyword));
    }
}
