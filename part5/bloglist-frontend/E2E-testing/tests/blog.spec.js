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

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await login(page, 'admin', 'password')
      })

      test('a new blog can be created', async ({ page }) => {
        await page.getByText('Create New Blog').click()
        await expect(page.getByText('Create New Blog')).toBeVisible()
        await page.getByLabel('Title').fill('My new blog')
        await page.getByLabel('Author').fill('Admin')
        await page.getByLabel('URL').fill('https://example.com/my-new-blog')
        await page.getByRole('button', { name: 'Create' }).click()

        const notification = page.locator('.notification')
        await expect(notification).toHaveText('A new blog "My new blog" by Admin added')

        await expect(page.getByText('My new blog Admin View')).toBeVisible()
        await expect(page.getByRole('button', { name: 'View' })).toBeVisible()
      })

      test('pass', () => {})

      describe('existing blog', () => {
        beforeEach(async ({ page }) => {
          await page.getByText('Create New Blog').click()
          await page.getByLabel('Title').fill('Existing Blog')
          await page.getByLabel('Author').fill('Admin')
          await page.getByLabel('URL').fill('https://example.com/existing-blog')
          await page.getByRole('button', { name: 'Create' }).click()

          await expect(page.getByText('Existing Blog Admin View')).toBeVisible()
          await expect(page.getByRole('button', { name: 'View' })).toBeVisible()
        })

        test('can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'View' }).click()
          await expect(page.getByText('Likes: 0 Like')).toBeVisible()
          await page.getByRole('button', { name: 'Like' }).click()
          await expect(page.getByText('Likes: 1 Like')).toBeVisible()
        })
      })
    })
  })
})