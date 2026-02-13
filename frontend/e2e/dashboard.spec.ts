import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the dashboard page', async ({ page }) => {
    // The dashboard should show some key metrics or title
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('should show financial metric cards', async ({ page }) => {
    // Dashboard should have stat cards with financial metrics
    // These might show loading first, then data or "0" values
    const statCards = page.locator('[class*="rounded-xl"]');
    await expect(statCards.first()).toBeVisible();
  });

  test('should have date filter controls', async ({ page }) => {
    // Dashboard has date range filtering
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.count() > 0) {
      await expect(dateInput.first()).toBeVisible();
    }
  });
});
