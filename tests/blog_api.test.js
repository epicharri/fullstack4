const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const logger = require('../utils/logger')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(
    helper.initialBlogs[0]
  )
  await blogObject.save()
  /*await api
    .post('/api/blogs')
    .send(blogObject)
    .expect(201)
    .expect(
      'Content-Type',
      /application\/json/
    )*/

  let blogObject2 = new Blog(
    helper.initialBlogs[1]
  )
  await blogObject2.save()
  /*await api
    .post('/api/blogs')
    .send(blogObject)
    .expect(201)
    .expect(
      'Content-Type',
      /application\/json/
    )*/
})

test('returned right amount of blogs', async () => {
  const response = await api.get(
    '/api/blogs'
  )
  
  
  expect(response.body.length).toBe(
    helper.initialBlogs.length
  )
})

test('you can add blogs via POST and number of blogs adds by one', async () => {
  const newBlog = {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect(
      'Content-Type',
      /application\/json/
    )

  const blogsAfter = await helper.blogsInDb()

  expect(blogsAfter.length).toBe(
    helper.initialBlogs.length + 1
  )
})

afterAll(() => {
  mongoose.connection.close()
})
