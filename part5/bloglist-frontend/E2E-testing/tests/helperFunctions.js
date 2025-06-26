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
}

module.exports = { login, resetDb }