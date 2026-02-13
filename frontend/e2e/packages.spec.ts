import { test, expect } from '@playwright/test';

test.describe('Packages Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/packages');
  });

  test('should display the packages page', async ({ page }) => {
    // Should show the page heading or add package button
    await expect(page.locator('text=Packages').first()).toBeVisible();
  });

  test('should have an add package button', async ({ page }) => {
    // Look for a button that creates a new package
    const addButton = page.locator('button', { hasText: /add|new|create/i });
    await expect(addButton.first()).toBeVisible();
  });

  test('should open add package modal when clicking add button', async ({
    page,
  }) => {
    const addButton = page.locator('button', { hasText: /add|new|create/i });
    await addButton.first().click();
    // Modal should appear with form fields
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('should show table structure', async ({ page }) => {
    // There should be a table element on the page
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });
});
