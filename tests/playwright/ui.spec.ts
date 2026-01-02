import { test, expect } from '@playwright/test';

test.describe('UI: dashboard page', () => {
  test('dashboard shows meta title and stats from API', async ({ page, request }) => {
    // Fetch expected values from API
    const statsRes = await request.get('/api/dashboard-stats');
    expect(statsRes.ok()).toBeTruthy();
    const statsBody = await statsRes.json();
    const expected = statsBody.stats;

    const metaRes = await request.get('/api/dashboard-meta');
    expect(metaRes.ok()).toBeTruthy();
    const metaBody = await metaRes.json();

    await page.goto('/dashboard');

    // Header title should contain the title
    await expect(page.getByText(metaBody.meta.title)).toBeVisible();

    // Check Total Athletes card shows the expected number
    const card = page.locator('.kpi-card', { hasText: 'Total Athletes' });
    await expect(card).toBeVisible();
    const valueText = (await card.locator('.kpi-value').textContent()) ?? '';
    const numeric = parseInt(valueText.replace(/[^0-9]/g, ''), 10);
    expect(numeric).toBe(expected.totalAthletes);
  });

  test('refresh button triggers API refresh and shows loading state', async ({ page }) => {
    await page.goto('/dashboard');
    const refreshBtn = page.getByRole('button', { name: /refresh dashboard|refresh/i });
    await expect(refreshBtn).toBeVisible();

    const updatedLocator = page.getByText(/^Updated:/);
    const before = (await updatedLocator.textContent()) ?? '';

    // Click (don't await)
    await refreshBtn.click();

    // Wait until either the button is disabled or the header 'Updated:' text changes
    await page.waitForFunction((before) => {
      const btn = document.querySelector('button[aria-label="Refresh dashboard"]');
      const disabled = btn ? (btn as HTMLButtonElement).disabled : false;
      const el = Array.from(document.querySelectorAll('div')).find((d) => d.textContent?.trim().startsWith('Updated:'));
      const updatedChanged = el && el.textContent !== before;
      return Boolean(disabled || updatedChanged);
    }, before, { timeout: 5000 });

    // Wait for the header 'Updated:' text to change (refresh complete)
    await page.waitForFunction((before) => {
      const el = Array.from(document.querySelectorAll('div')).find((d) => d.textContent?.trim().startsWith('Updated:'));
      return Boolean(el && el.textContent !== before);
    }, before, { timeout: 5000 });

    // Button should be enabled again and show the label
    await expect(refreshBtn).toBeEnabled();
    await expect(refreshBtn).toHaveText(/Refresh/i, { timeout: 5000 });

    const after = (await updatedLocator.textContent()) ?? '';
    expect(after).not.toBe(before);

    // The updated label should include a relative time indicator (e.g., "ago", "in", "now", "just now")
    expect(after).toMatch(/ago|in|now|just/i);
  });
});
