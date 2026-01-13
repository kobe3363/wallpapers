import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
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
        if (!(await optionToSelect.isVisible())) {
            console.log(`Meniu užsidarė, bandome atidaryti dar kartą, kad paspaustume "${categoryName}"...`);
            await this.categoryTrigger.click();
        }
        await optionToSelect.click();
        await expect(this.categoryTrigger).toHaveText(categoryName);
    }

    async searchFor(keyword: string) {
        await this.searchInput.click();
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
        await expect(this.page).toHaveURL(new RegExp(keyword));
    }
}
