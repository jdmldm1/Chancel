import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check that the page has loaded
    expect(page).toHaveURL('/')
  })

  test('should have a title', async ({ page }) => {
    await page.goto('/')

    // Expect page to have a title
    await expect(page).toHaveTitle(/BibleProject|Bible Study/i)
  })
})

test.describe('Authentication Flow', () => {
  test.skip('should navigate to login page', async ({ page }) => {
    // TODO: Implement when auth is ready
    await page.goto('/')
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')
  })

  test.skip('should allow user to sign in', async ({ page }) => {
    // TODO: Implement when auth is ready
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })
})

test.describe('Session Management', () => {
  test.skip('should allow leader to create a session', async ({ page }) => {
    // TODO: Implement when sessions are ready
    await page.goto('/sessions/new')
    await page.fill('input[name="title"]', 'Test Study Session')
    await page.fill('textarea[name="description"]', 'This is a test session')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/sessions\/\w+/)
  })
})
