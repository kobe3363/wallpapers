import { test, expect } from '../fixtures/test-setup';
import { RingtonesAndWallpapersPage } from '../pages/ringtones-and-wallpapers.page';
import { WallpapersPage } from '../pages/wallpapers.page';

test('User can search and download free wallpaper', async ({ page }) => {
    const ringtonesAndWallpapersPage = new RingtonesAndWallpapersPage(page);
    const wallpapersPage = new WallpapersPage(page);
    const searchTerm = 'sunrise';

    await ringtonesAndWallpapersPage.goto('/ringtones-and-wallpapers');
    await ringtonesAndWallpapersPage.selectCategory('Wallpapers');
    await ringtonesAndWallpapersPage.searchFor(searchTerm);
    await wallpapersPage.filterByPrice('Free');
    
    const downloadedFilePath = await wallpapersPage.downloadFirstWallpaper(searchTerm);
    expect(downloadedFilePath).toBeTruthy();
});
