const { test, expect, beforeEach, describe, afterEach } = require('@playwright/test')
const { login, resetDb, createBlog } = require('./helperFunctions')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  afterEach(async ({ request }) => {
    await resetDb(request)
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
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
        await createBlog(page, 'My new blog', 'Admin', 'https://example.com/my-new-blog')

        const notification = page.locator('.notification')
        await expect(notification).toHaveText('A new blog "My new blog" by Admin added')

        await expect(page.getByText('My new blog Admin View')).toBeVisible()
        await expect(page.getByRole('button', { name: 'View' })).toBeVisible()
      })

      describe('existing blog', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'Existing Blog', 'Admin', 'https://example.com/existing-blog')
        })

        test('can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'View' }).click()
          await expect(page.getByText('Likes: 0 Like')).toBeVisible()
          await page.getByRole('button', { name: 'Like' }).click()
          await expect(page.getByText('Likes: 1 Like')).toBeVisible()
        })

        test('can be removed by the user who created it', async ({ page }) => {
          await page.getByRole('button', { name: 'View' }).click()
          await page.getByRole('button', { name: 'Remove' }).click()
          // Confirm the removal in the confirmation dialog
          page.on('dialog', async dialog => {
            await dialog.accept()
          })
          await expect(page.getByRole('button', { name: 'View' })).not.toBeVisible()
        })

        test('cannot be removed by another user', async ({ page }) => {
          await page.getByRole('button', { name: 'Logout' }).click()
          await login(page, 'root', 'password')
          await page.getByRole('button', { name: 'View' }).click()
          await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
          await expect(page.getByRole('button', { name: 'Like' })).toBeVisible()
          await expect(page.getByRole('button', { name: 'Hide' })).toBeVisible()
        })

        test('blogs are arranged in order of likes', async ({ page }) => {
          await page.getByRole('button', { name: 'View' }).click()
          await page.getByRole('button', { name: 'Like' }).click()
          await page.getByRole('button', { name: 'Hide' }).click()

          // Create another blog with more likes
          await createBlog(page, 'Another Blog', 'Admin', 'https://example.com/another-blog')
          await expect(page.getByText('A new blog "Another Blog" by Admin added')).toBeVisible()
          // Like the new blog
          await page.getByRole('button', { name: 'View' }).last().click()
          await page.getByRole('button', { name: 'Like' }).last().click({ delay: 2000, clickCount: 2 }) // Add a delay to ensure the like is registered

          await expect(page.getByText('Likes: 2 Like')).toBeVisible()
          await page.getByRole('button', { name: 'Hide' }).last().click()

          // Check the order of blogs
          const blogs = await page.locator('.blog').all()
          expect(blogs.length).toBeGreaterThanOrEqual(2)
          expect(await blogs[0].textContent()).toContain('Another Blog')
        })
      })
    })
  })
})