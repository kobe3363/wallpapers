import { test, expect } from '../fixtures/test-setup';
import { RingtonesAndWallpapersPage, WallpapersPage} from '../pages';

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
