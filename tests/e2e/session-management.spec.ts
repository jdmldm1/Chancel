import { test, expect, Page } from '@playwright/test'

// Helper function to log in as a leader
async function loginAsLeader(page: Page) {
  await page.goto('/auth/login')
  await page.fill('input[name="email"]', 'leader@example.com')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await page.waitForURL('/') // Assuming successful login redirects to homepage or dashboard
}

test.describe('Session Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsLeader(page)
  })

  test('should allow a leader to create a new session', async ({ page }) => {
    await page.goto('/sessions')
    await page.click('text=Create New Session')

    await expect(page.locator('h1')).toHaveText('Manage Sessions')

    await page.fill('input[name="title"]', 'Playwright Test Session')
    await page.fill(
      'textarea[name="description"]',
      'This session was created by Playwright.'
    )
    // Set scheduled date to a future date, e.g., tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDateString = tomorrow.toISOString().split('T')[0]
    await page.fill('input[name="scheduledDate"]', tomorrowDateString)

    // Fill in scripture passage details (first passage)
    await page.fill('input[name="scripturePassages.0.book"]', 'John')
    await page.fill('input[name="scripturePassages.0.chapter"]', '3')
    await page.fill('input[name="scripturePassages.0.verseStart"]', '16')
    await page.fill(
      'textarea[name="scripturePassages.0.content"]',
      'For God so loved the world...'
    )

    await page.click('button[type="submit"]')

    // Verify the session is listed
    await expect(page.locator('text=Playwright Test Session')).toBeVisible()
  })

  test('should allow a leader to delete a session', async ({ page }) => {
    // First, create a session to delete
    await page.goto('/sessions')
    await page.click('text=Create New Session')
    await page.fill('input[name="title"]', 'Session to Delete')
    await page.fill('textarea[name="description"]', 'This session will be deleted.')
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 2)
    await page.fill('input[name="scheduledDate"]', futureDate.toISOString().split('T')[0])
    await page.fill('input[name="scripturePassages.0.book"]', 'Acts')
    await page.fill('input[name="scripturePassages.0.chapter"]', '1')
    await page.fill('input[name="scripturePassages.0.verseStart"]', '8')
    await page.fill('textarea[name="scripturePassages.0.content"]', 'But you will receive power...')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Session to Delete')).toBeVisible()

    // Now, delete the session
    // This part assumes there's a delete button/mechanism visible on the session list item
    // You'll need to adapt this selector based on your actual UI implementation
    const sessionToDelete = page.locator('li', { hasText: 'Session to Delete' })
    // Assuming a delete button exists within the session list item. If not, this needs to be adapted.
    await sessionToDelete.locator('button', { hasText: 'Delete' }).click()

    // Confirm deletion (if a confirmation dialog appears)
    // await page.click('text=Confirm Delete') // Uncomment if there's a confirmation step

    // Verify the session is no longer listed
    await expect(page.locator('text=Session to Delete')).not.toBeVisible()
  })
})
