import  { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

import blogService from '../services/blogs'

// Mock localStorage for logged in user
beforeEach(() => {
  localStorage.setItem('loggedUserInfo', JSON.stringify({ username: 'testuser' }))
})

const blog = {
  id: '1',
  title: 'Test Blog',
  author: 'Test Author',
  url: 'http://testblog.com',
  likes: 5,
  user: {
    id: '123',
    name: 'Test User',
    username: 'testuser'
  }
}

test('rendering content', () => {
  const { container } = render(<Blog blog={blog} setBlogs={() => {}} view={null} setView={() => {}} notify={() => {}} />)
  const dev = container.querySelector('.view')
  const titleElement = screen.getByText('Test Blog')

  expect(titleElement).toBeDefined()
  expect(dev).toBeDefined()
  expect(dev).toHaveTextContent('View')
  expect(dev).toHaveClass('view')
})

test('that the component displaying a blog renders the blog\'s title and author,\
  but does not render its URL or number of likes by default', () => {

  const { container } = render(<Blog blog={blog} setBlogs={() => {}} view={null} setView={() => {}} notify={() => {}} />)
  const titleElement = screen.getByText('Test Blog')
  const authorElement = screen.getByText('Test Author')
  const urlElement = screen.queryByText('http://testblog.com')
  const likesElement = screen.queryByText('Likes: 15')
  const viewButton = container.querySelector('.view')

  expect(titleElement).toBeDefined()
  expect(titleElement).toHaveTextContent('Test Blog')
  expect(authorElement).toBeDefined()
  expect(authorElement).toHaveTextContent('Test Author')

  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()

  expect(viewButton).toBeDefined()
  expect(viewButton).toHaveTextContent('View')
  expect(viewButton).toHaveClass('view')

  expect(container.querySelector('.hide')).toBeNull()
  expect(container.querySelector('.like')).toBeNull()
  expect(container.querySelector('.remove')).toBeNull()
})

test('that the blog\'s URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
  const user = userEvent.setup()
  const setView = vi.fn()
  const { container, rerender } = render(<Blog blog={blog} setBlogs={() => {}} view={null} setView={setView} notify={() => {}} />)
  // screen.debug(container.querySelector('.view'))
  await user.click(container.querySelector('.view'))
  expect(setView.mock.calls).toHaveLength(1)
  expect(setView).toHaveBeenCalledWith(blog.id)

  rerender(<Blog blog={blog} setBlogs={() => {}} view={blog.id} setView={setView} notify={() => {}} />)
  expect(container.querySelector('.hide')).toBeDefined()
  expect(container.querySelector('.hide')).toHaveTextContent('Hide')
  expect(container.querySelector('.like')).toBeDefined()
  expect(container.querySelector('.like')).toHaveTextContent('Like')
  expect(container.querySelector('.remove')).toBeDefined()
  expect(container.querySelector('.remove')).toHaveTextContent('Remove')
  expect(container.querySelector('.view')).toBeNull()
})

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const user = userEvent.setup()
  // Mock the blogService
  vi.mock('../services/blogs', () => ({
    default: {
      like: vi.fn().mockResolvedValue({})  // resolves to updated blog
    }
  }))
  const setBlogs = vi.fn()
  const { container } = render(<Blog blog={blog} setBlogs={setBlogs} view={blog.id} setView={() => {}} notify={() => {}} />)
  const likeButton = container.querySelector('.like')
  expect(likeButton).toBeDefined()
  expect(likeButton).toHaveTextContent('Like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(blogService.like).toHaveBeenCalledTimes(2)
  expect(setBlogs).toHaveBeenCalledTimes(2)
})