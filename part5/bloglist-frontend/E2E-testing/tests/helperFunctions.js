const login = async (page, username, password) => {
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const resetDb = async ( request ) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data: {
      username: 'admin',
      password: 'password',
      name: 'Admin',
    }
  })

  await request.post('/api/users', {
    data: {
      username: 'root',
      password: 'password',
      name: 'Root',
    }
  })
}

const createBlog = async (page, title, author, url) => {
  await page.getByText('Create New Blog').click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('URL').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}

module.exports = { login, resetDb, createBlog }