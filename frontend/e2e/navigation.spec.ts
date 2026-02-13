import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load the dashboard page by default', async ({ page }) => {
    await page.goto('/');
    // The sidebar should be visible
    await expect(page.locator('text=Nwmoon')).toBeVisible();
    await expect(page.locator('text=Finance System')).toBeVisible();
  });

  test('should have sidebar navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
    await expect(page.locator('nav >> text=Packages')).toBeVisible();
    await expect(page.locator('nav >> text=Teachers')).toBeVisible();
    await expect(page.locator('nav >> text=Sessions')).toBeVisible();
    await expect(page.locator('nav >> text=Transactions')).toBeVisible();
  });

  test('should navigate to Packages page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav >> text=Packages').click();
    await expect(page).toHaveURL('/packages');
  });

  test('should navigate to Teachers page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav >> text=Teachers').click();
    await expect(page).toHaveURL('/teachers');
  });

  test('should navigate to Sessions page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav >> text=Sessions').click();
    await expect(page).toHaveURL('/sessions');
  });

  test('should navigate to Transactions page', async ({ page }) => {
    await page.goto('/');
    await page.locator('nav >> text=Transactions').click();
    await expect(page).toHaveURL('/transactions');
  });

  test('should navigate back to Dashboard', async ({ page }) => {
    await page.goto('/packages');
    await page.locator('nav >> text=Dashboard').click();
    await expect(page).toHaveURL('/');
  });
});
