import { test, expect } from '@playwright/test';

test.describe('Transactions Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/transactions');
  });

  test('should display the transactions page', async ({ page }) => {
    await expect(page.locator('text=Transactions').first()).toBeVisible();
  });

  test('should have an add transaction button', async ({ page }) => {
    const addButton = page.locator('button', { hasText: /add|new|create/i });
    await expect(addButton.first()).toBeVisible();
  });

  test('should open add transaction modal when clicking add button', async ({
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

  test('should have filter controls', async ({ page }) => {
    // Should have filter/search elements
    const filterElements = page.locator('select, input[type="text"], input[type="search"]');
    await expect(filterElements.first()).toBeVisible();
  });
});
