import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import blogService from '../services/blogs'
import { expect } from 'vitest'


test('that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const user = userEvent.setup()
  vi.mock('../services/blogs', () => ({
    default: {
      create: vi.fn().mockResolvedValue({
        title: 'New Blog',
        author: 'New Author',
        url: 'http://newblog.com',
        likes: 0,
        id: '12345',
        user: {
          id: 'user123',
          name: 'Test User',
          username: 'testuser'
        } })
    }
  }))
  const setBlogs = vi.fn()
  const notify = vi.fn()
  const blogFormRef = { current: { toggleVisibility: vi.fn() } }
  render(<BlogForm setBlogs={setBlogs} notify={notify} blogFormRef={blogFormRef} />)
  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')
  const likesInput = screen.getByLabelText('Likes:')
  const createButton = screen.getByText('Create')

  await user.type(titleInput, 'New Blog')
  await user.type(authorInput, 'New Author')
  await user.type(urlInput, 'http://newblog.com')
  await user.type(likesInput, '0')

  // Check if the form is submitted and the new blog is created
  await user.click(createButton)
  expect(screen.queryByText('Create New Blog')).toBeInTheDocument()
  expect(blogService.create).toHaveBeenCalledTimes(1)
  expect(blogService.create).toHaveBeenCalledWith({
    title: 'New Blog',
    author: 'New Author',
    url: 'http://newblog.com',
    likes: 0
  })
  expect(setBlogs).toHaveBeenCalledWith(expect.any(Function))
  expect(notify).toHaveBeenCalledWith('A new blog "New Blog" by New Author added', 'success')
  expect(blogFormRef.current.toggleVisibility).toHaveBeenCalled()
  // Check if the form fields are reset after submission
  expect(titleInput.value).toBe('')
  expect(authorInput.value).toBe('')
  expect(urlInput.value).toBe('')
  expect(likesInput.value).toBe('0')
  screen.debug()
})