import { devices, type PlaywrightTestProject } from '@playwright/test';


const CHROMIUM_ARGS = [
    '--start-maximized',
    '--disable-features=Translate,TranslateUI',
    '--disable-translate',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-popup-blocking',
    '--disable-extensions',
    '--hide-crash-restore-bubble',
    '--disable-blink-features=AutomationControlled'
];

export const ChromeProject: PlaywrightTestProject = {
    name: 'Chrome',
    use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: { args: CHROMIUM_ARGS }
    },
};

export const EdgeProject: PlaywrightTestProject = {
    name: 'Microsoft Edge',
    use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        launchOptions: { args: CHROMIUM_ARGS }
    },
};

export const FirefoxProject: PlaywrightTestProject = {
    name: 'Firefox',
    use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
            firefoxUserPrefs: {
                'dom.events.asyncClipboard.readText': true,
                'dom.events.testing.asyncClipboard': true,
            },
        },
    },
};

export const SafariProject: PlaywrightTestProject = {
    name: 'Webkit Safari',
    use: {
        ...devices['Desktop Safari'],
    },
};

export const DesktopBrowsers = [
    ChromeProject,
    EdgeProject,
    FirefoxProject,
    SafariProject
];

export const FastBrowsers = [
    ChromeProject
];

export const CIBrowsers = [
    ChromeProject,
    FirefoxProject,
    SafariProject
];
