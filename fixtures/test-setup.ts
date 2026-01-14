import { test as base } from '@playwright/test';
import { BasePage } from '../pages';

type MyFixtures = {
    basePage: BasePage;
};

export const test = base.extend<MyFixtures>({
    basePage: [async ({ page }, use) => {
        await page.addInitScript(() => {
            const killBanner = () => {
                const ids = ['didomi-host', 'didomi-popup', 'didomi-notice'];
                const classes = ['didomi-popup-backdrop', 'didomi-popup-open'];

                let found = false;

                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.remove();
                        found = true;
                    }
                });

                classes.forEach(cls => {
                    const els = document.getElementsByClassName(cls);
                    for (let i = 0; i < els.length; i++) {
                        els[i].remove();
                        found = true;
                    }
                });

                if (found || document.body.style.overflow === 'hidden') {
                    document.body.style.overflow = 'visible';
                    document.body.style.position = 'static';
                    document.body.style.height = 'auto';
                }
            };

            setInterval(killBanner, 50);
            
            const observer = new MutationObserver(killBanner);
            observer.observe(document.documentElement, { childList: true, subtree: true });
        });

        await page.route('**/*didomi*', route => route.abort());

        const basePage = new BasePage(page);
        await use(basePage);
        
    }, { auto: true }], 
});

export { expect } from '@playwright/test';
