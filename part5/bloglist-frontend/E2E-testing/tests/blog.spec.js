const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, resetDb } = require('./helperFunctions')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
    beforeEach(async ({ request }) => {
      await resetDb(request)
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'admin', 'password')

      const notification = page.locator('.notification')
      await expect(notification).toHaveText('Welcome Admin')

      const logoutButton = page.getByRole('button', { name: 'Logout' })
      await expect(logoutButton).toBeVisible()
      await expect(page.getByText('blogs')).toBeVisible()
      await expect(page.getByText('Create New Blog')).toBeVisible()
      await expect(page.getByText('Admin logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'admin', 'wrongPassword')

      await expect(page.locator('.notification')).toHaveText('Login failed. Please check your credentials.')
      await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible()
      await expect(page.getByText('blogs')).not.toBeVisible()
      await expect(page.getByText('Create New Blog')).not.toBeVisible()
      await expect(page.getByText('Admin logged in')).not.toBeVisible()
    })
  })
})