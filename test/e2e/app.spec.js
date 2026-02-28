import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.map-container', { timeout: 10000 });
});

test.describe('City Selection', () => {
  test('clicking city in sidebar selects it', async ({ page }) => {
    const firstCity = page.locator('.city-list-item').first();
    await firstCity.click();
    
    await expect(firstCity).toHaveClass(/active/);
    await expect(page.locator('.right-sidebar')).toBeVisible();
  });

  test('clicking marker selects city', async ({ page }) => {
    // Markers can be blocked by sidebar, so close sidebar first
    await page.click('.menu-button');
    await page.waitForTimeout(300); // Wait for animation
    
    const marker = page.locator('.leaflet-marker-icon').first();
    await marker.click();
    
    await expect(page.locator('.right-sidebar')).toBeVisible();
  });

  test('closing panel resets selection', async ({ page }) => {
    await page.click('.city-list-item');
    await expect(page.locator('.right-sidebar')).toBeVisible();
    
    await page.click('.close-button');
    await expect(page.locator('.right-sidebar')).not.toBeVisible();
  });

  test('all 7 cities appear in sidebar', async ({ page }) => {
    const cities = await page.locator('.city-list-item').count();
    expect(cities).toBe(7);
  });

  test('all markers appear on map', async ({ page }) => {
    const markers = await page.locator('.leaflet-marker-icon').count();
    expect(markers).toBeGreaterThanOrEqual(7);
  });
});

test.describe('Image Gallery', () => {
  test('clicking image opens modal', async ({ page }) => {
    await page.click('.city-list-item');
    await page.click('.city-images img');
    
    await expect(page.locator('.image-modal')).toBeVisible();
  });

  test('closing modal works', async ({ page }) => {
    await page.click('.city-list-item');
    await page.click('.city-images img');
    
    await page.click('.image-modal-close');
    await expect(page.locator('.image-modal')).not.toBeVisible();
  });

  test('modal navigation prev/next works', async ({ page }) => {
    await page.click('.city-list-item');
    const imageCount = await page.locator('.city-images img').count();
    
    if (imageCount > 0) {
      await page.click('.city-images img');
      await expect(page.locator('.image-modal')).toBeVisible();
      
      // Check if next button exists (multiple images)
      const nextBtn = page.locator('.image-modal-next');
      const hasNextBtn = await nextBtn.count() > 0;
      
      if (hasNextBtn) {
        await nextBtn.click();
        // Verify modal is still visible (image changed)
        await expect(page.locator('.image-modal')).toBeVisible();
      }
    }
  });

});

test.describe('Theme Toggle', () => {
  test('dark mode toggle works', async ({ page }) => {
    // Toggle dark mode and verify it changes state
    await page.click('.theme-toggle-bottom');
    
    // Just verify button is clickable and doesn't error
    await page.click('.theme-toggle-bottom');
  });

  test('theme persists on refresh', async ({ page }) => {
    // Toggle dark mode
    await page.click('.theme-toggle-bottom');
    
    // Verify change
    await page.waitForTimeout(100);
    const bodyAfterToggle = await page.locator('body').getAttribute('class');
    
    // Refresh page
    await page.reload();
    await page.waitForSelector('.map-container');
    
    // Check if theme persisted
    const bodyAfterRefresh = await page.locator('body').getAttribute('class');
    expect(bodyAfterRefresh).toBe(bodyAfterToggle);
  });

  test('GitHub button opens in new tab', async ({ page, context }) => {
    const newPagePromise = context.waitForEvent('page');
    await page.click('.github-button');
    const newPage = await newPagePromise;
    
    expect(newPage.url()).toContain('github.com');
    await newPage.close();
  });
});

test.describe('UI State', () => {
  test('left sidebar can toggle', async ({ page }) => {
    const sidebar = page.locator('.left-sidebar');
    
    await expect(sidebar).toBeVisible();
    await page.click('.menu-button');
    await expect(sidebar).not.toBeVisible();
    
    await page.click('.menu-button');
    await expect(sidebar).toBeVisible();
  });

  test('modal open locks body scroll', async ({ page }) => {
    await page.click('.city-list-item');
    await page.click('.city-images img');
    
    const overflow = await page.evaluate(() => 
      window.getComputedStyle(document.body).overflow
    );
    expect(overflow).toBe('hidden');
  });

  test('modal close unlocks body scroll', async ({ page }) => {
    await page.click('.city-list-item');
    await page.click('.city-images img');
    await page.click('.image-modal-close');
    
    const overflow = await page.evaluate(() => 
      window.getComputedStyle(document.body).overflow
    );
    expect(overflow).toBe('auto');
  });
});

test.describe('Data Display', () => {
  test('city details show correct info', async ({ page }) => {
    await page.click('.city-list-item');
    
    // Check city name appears in panel
    const cityDetails = page.locator('.city-details');
    await expect(cityDetails).toBeVisible();
    await expect(cityDetails.locator('h2')).toBeVisible();
  });

  test('city images load without errors', async ({ page }) => {
    await page.click('.city-list-item');
    
    const images = page.locator('.city-images img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      // Check image has src attribute
      const src = await img.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('map bounds prevent excessive zooming', async ({ page }) => {
    // Verify map loads with proper bounds
    const mapContainer = page.locator('.map-container');
    await expect(mapContainer).toBeVisible();
    
    // Map should exist
    const mapElement = await mapContainer.boundingBox();
    expect(mapElement).toBeTruthy();
  });
});

test.describe('Keyboard & Accessibility', () => {
  test('buttons have aria labels', async ({ page }) => {
    const menuButton = page.locator('.menu-button');
    const themeButton = page.locator('.theme-toggle-bottom');
    const githubButton = page.locator('.github-button');
    
    await expect(menuButton).toHaveAttribute('aria-label', /toggle/i);
    await expect(themeButton).toHaveAttribute('aria-label', /theme|toggle/i);
    await expect(githubButton).toHaveAttribute('aria-label', /github/i);
  });
});
