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
        await this.categoryTrigger.click();
        const optionToSelect = this.page.getByRole('menuitemradio', { name: categoryName });
        for (let i = 0; i < 3; i++) {
            if (await optionToSelect.isVisible()) break;

            console.log(`Bandymas atidaryti meniu (${i + 1}/3)...`);
            await this.categoryTrigger.click({ force: true });

            // Firefox kartais lagina piešiant meniu
            await this.page.waitForTimeout(500);
        }
        await optionToSelect.waitFor({ state: 'attached', timeout: 5000 });
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
