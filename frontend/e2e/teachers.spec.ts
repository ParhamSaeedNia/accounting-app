import { test, expect } from '@playwright/test';

test.describe('Teachers Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/teachers');
  });

  test('should display the teachers page', async ({ page }) => {
    await expect(page.locator('text=Teachers').first()).toBeVisible();
  });

  test('should have an add teacher button', async ({ page }) => {
    const addButton = page.locator('button', { hasText: /add|new|create/i });
    await expect(addButton.first()).toBeVisible();
  });

  test('should open add teacher modal when clicking add button', async ({
    page,
  }) => {
    const addButton = page.locator('button', { hasText: /add|new|create/i });
    await addButton.first().click();
    // Modal should appear with form fields
    await expect(page.locator('input').first()).toBeVisible();
  });

  test('should show table structure', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('should display stat cards for teacher counts', async ({ page }) => {
    // Should show stats like Total, Active, Inactive
    await expect(page.locator('text=Total').first()).toBeVisible();
  });
});
