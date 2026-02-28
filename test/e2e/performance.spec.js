import { test, expect } from '@playwright/test';

/**
 * Performance benchmarks
 * Run before and after optimizations to measure improvement
 * Usage: npm run test:e2e -- performance.spec.js
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('.map-container', { timeout: 10000 });
});

test.describe('Performance Benchmarks', () => {
  test('initial page load performance', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      };
    });

    console.log('\n📊 Initial Page Load:');
    console.log(`  DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`  Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    console.log(`  Total Time: ${metrics.totalTime.toFixed(2)}ms`);

    // Just log, don't assert (benchmarks vary)
    expect(metrics.totalTime).toBeGreaterThan(0);
  });

  test('image loading performance', async ({ page }) => {
    await page.click('.city-list-item'); // Select first city
    await page.waitForSelector('.city-images img');

    const metrics = await page.evaluate(() => {
      const images = document.querySelectorAll('.city-images img');
      const imageMetrics = Array.from(images).map(img => {
        const resourceTiming = performance.getEntriesByName(img.src)[0];
        return {
          src: img.src.slice(-20), // Last 20 chars
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          loadTime: resourceTiming ? (resourceTiming.responseEnd - resourceTiming.requestStart).toFixed(2) : 'N/A',
        };
      });

      return {
        imageCount: images.length,
        images: imageMetrics,
        totalImageSize: Array.from(images).reduce((sum, img) => sum + (img.naturalWidth * img.naturalHeight), 0),
      };
    });

    console.log('\n🖼️  Image Loading Performance:');
    console.log(`  Images in Panel: ${metrics.imageCount}`);
    metrics.images.forEach((img, i) => {
      console.log(`    [${i + 1}] ${img.src} (${img.naturalWidth}x${img.naturalHeight}) - ${img.loadTime}ms`);
    });
    console.log(`  Total Pixel Data: ${metrics.totalImageSize.toLocaleString()} pixels`);
  });

  test('marker rendering performance', async ({ page }) => {
    await page.waitForSelector('.leaflet-marker-icon');

    const metrics = await page.evaluate(() => {
      const markers = document.querySelectorAll('.leaflet-marker-icon');
      return {
        markerCount: markers.length,
        markerTime: markers[0] ? performance.now() : 0, // Time when markers are ready
      };
    });

    console.log('\n📍 Marker Rendering:');
    console.log(`  Markers on Map: ${metrics.markerCount}`);
    console.log(`  Render Time: ${metrics.markerTime.toFixed(2)}ms`);
  });

  test('animation frame rate', async ({ page }) => {
    await page.click('.city-list-item'); // Trigger animation

    const fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        const startTime = performance.now();

        const countFrames = () => {
          frameCount++;
          const elapsed = performance.now() - startTime;
          if (elapsed < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frameCount);
          }
        };

        requestAnimationFrame(countFrames);
      });
    });

    console.log('\n⚡ Animation Frame Rate:');
    console.log(`  Frames per second: ${fps} FPS`);

    // Headless mode is slower; just ensure positive FPS
    expect(fps).toBeGreaterThan(0);
  });

  test('dom nodes and memory', async ({ page }) => {
    await page.click('.city-list-item');

    const metrics = await page.evaluate(() => {
      return {
        domNodes: document.querySelectorAll('*').length,
        documentSize: new Blob([document.documentElement.outerHTML]).size,
      };
    });

    console.log('\n💾 DOM & Memory:');
    console.log(`  DOM Nodes: ${metrics.domNodes}`);
    console.log(`  Document Size: ${(metrics.documentSize / 1024).toFixed(2)} KB`);
  });
});
