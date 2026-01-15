import { test as base } from '@playwright/test';
import { BasePage } from '../pages';

type MyFixtures = {
    basePage: BasePage;
};

const BLOCKED_PATTERNS = [
    '**/*google*/*ads*',
    '**/*doubleclick*',
    '**/*googlesyndication*',
    '**/*pubads*',
    '**/*moatads*'
];

export const test = base.extend<MyFixtures>({
    basePage: [async ({ page, context }, use) => {
        for (const url of BLOCKED_PATTERNS) {
            await context.route(url, route => route.abort('blockedbyclient'));
        }

        // STORAGE INJECTION
        await context.addInitScript(() => {
            const didomiToken = "eyJ1c2VyX2lkIjoiMTliYzBjMGYtOWRhMC02ZTRjLWE3YjItNDljYjQzNzNlYjlmIiwiY3JlYXRlZCI6IjIwMjYtMDEtMTVUMDg6MjM6NTEuMDAyWiIsInVwZGF0ZWQiOiIyMDI2LTAxLTE1VDA4OjIzOjUzLjg5N1oiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIiwiYW1hem9uIiwiYzp3d3dnb29nbGUtVjh4cWFFakIiLCJjOmdvb2dsZWFuYS00VFhuSmlnUiIsImM6YW1hem9uYWQtaU1VcThOZ1oiXX0sInB1cnBvc2VzIjp7ImVuYWJsZWQiOlsiZGV2aWNlX2NoYXJhY3RlcmlzdGljcyIsImdlb2xvY2F0aW9uX2RhdGEiXX0sInZlbmRvcnNfbGkiOnsiZW5hYmxlZCI6WyJnb29nbGUiXX0sInZlcnNpb24iOjIsImFjIjoiQUZtQUNBRmsuQUZtQUNBRmsifQ==";
            const euConsent = "CQeEcwAQeEcwAAHABBENCNFsAP_gAEPgAAAAL6NR_G__bWlr-bb3aftkeYxP9_hr7sQxBgbJk24FzLvW7JwXx2E5NAzatqIKmRIAu3TBIQNlHJDURVCgKIgFryDMaEyUoTNKJ6BkiFMZI2tYCFxvm4tjWQCY4vr99lc1mB-N7dr82dzyy6hHn3a5_2S1UJCdIYetDfv8ZBKT-9IEd_x8v4v4_F7pE2-eS1n_pGvp4j9-YnM_dBmxt-TSff7Pn__rl_e7X_vc_n37v94XH77v_-__f_-7___2b_-_wXsABMNCogjLIgQCBQMIIEACgrCACgQBAAAkDRAQAmDAhyBgAusJkAIAUAAwQAgABBgACAAASABCIAKACAQAgQCBQABgAQBAQAEDAAGACxEAgABAdAxTAggECwASMyqDTAlAASCAlsqEEoGBBXCEIs8AggREwUAAAJABQEAADwWAhJICViQQBcQTQAAEAAAUQIkCKQswBBUGaLQFgScBkaYBg-YJklOgyQJghISTYhN6Ew8UhRAghyA2KWYA6eIKAAAA.f_wACHwAAAAAid5id";

            window.localStorage.setItem('didomi_token', didomiToken);
            window.localStorage.setItem('euconsent-v2', euConsent);            
            window.localStorage.setItem('cwgl', '{"country":"LT","region":"VL","city":"Vilnius","postalCode":"07004"}');
        });

        const basePage = new BasePage(page);
        await use(basePage);
        
    }, { auto: true }], 
});

export { expect } from '@playwright/test';
