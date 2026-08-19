import { test, expect } from '@playwright/test'

test('open ui with ddd activator', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.type('ddd')
    await expect(page.locator('dank-dev-ui #ui.open')).toBeVisible()
})
