import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:3000';

test.describe('Authentication Flow', () => {
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const password = 'Password123';

  test('should allow a user to sign up', async ({ page }) => {
    await page.goto(`${UI_URL}/sign-up`);

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // After sign-up, the user is typically redirected to a confirmation page
    // or their dashboard. We'll check for a redirect to the home page
    // and the presence of a user menu as an indicator of being logged in.
    await page.waitForURL(UI_URL + '/');
    await expect(page.getByRole('button', { name: /Test User/i })).toBeVisible();
  });

  test('should allow a logged-in user to sign out', async ({ page }) => {
    // First, sign up and log in the user
    await page.goto(`${UI_URL}/sign-up`);
    await page.fill('input[name="name"]', 'SignOut Test');
    await page.fill('input[name="email"]', `test_signout_${Date.now()}@example.com`);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(UI_URL + '/');

    // Now, sign out
    await page.getByRole('button', { name: /SignOut Test/i }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();

    // After signing out, the user should be redirected to the sign-in page
    // or home page, and the sign-in button should be visible.
    await page.waitForURL(UI_URL + '/');
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('should allow an existing user to sign in', async ({ page }) => {
    // First, create the user to sign in with
    await page.goto(`${UI_URL}/sign-up`);
    await page.fill('input[name="name"]', 'Sign In Test');
    await page.fill('input[name="email"]', uniqueEmail); // Use the same email from the first test
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(UI_URL + '/');
    // Sign out to test signing back in
    await page.getByRole('button', { name: /Sign In Test/i }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await page.waitForURL(UI_URL + '/');

    // Now, navigate to sign-in page and log in
    await page.goto(`${UI_URL}/sign-in`);
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // After sign-in, the user should be on the home page and see their user menu
    await page.waitForURL(UI_URL + '/');
    await expect(page.getByRole('button', { name: /Sign In Test/i })).toBeVisible();
  });
});
