const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get(
    'authorization'
  )
  if (
    authorization &&
    authorization
      .toLowerCase()
      .startsWith('bearer ')
  ) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get(
  '/',
  async (request, response, next) => {
    const blogs = await Blog.find(
      {}
    ).populate('user', {
      username: 1,
      name: 1
    })
    response.json(
      blogs.map(blog => blog.toJSON())
    )
  }
)

blogsRouter.post(
  '/',
  async (request, response, next) => {
    const body = request.body
    const token = getTokenFrom(request)

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.SECRET
      )
      if (!token || !decodedToken.id) {
        return response
          .status(401)
          .json({
            error:
              'token missing or invalid'
          })
      }

      const user = await User.findById(
        decodedToken.id
      )

      const blog = new Blog({
        id: body.id,
        title: body.title,
        author: body.author,
        url: body.url,
        likes:
          body.likes === undefined
            ? 0
            : body.likes,
        user: user._id
      })

      try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(
          savedBlog._id
        )
        await user.save()
        response.json(
          savedBlog.toJSON()
        )
      } catch (exception) {
        //next(exception)
        response.status(400).end()
      }
    } catch (exception) {
      response.status(400).end()
    }
  }
)

blogsRouter.get(
  '/:id',
  async (request, response, next) => {
    try {
      const blog = await Blog.findById(
        request.params.id
      )
      if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    } catch (exception) {
      next(exception)
    }
  }
)

blogsRouter.delete(
  '/:id',
  async (request, response, next) => {
    const token = getTokenFrom(request)
    try {
      try {
        const blog = await User.findById(
          request.params.id
        )
        if (
          user._id.toString() ===
          blog.user._id.toString()
        ) {
          await Blog.findByIdAndRemove(
            request.params.id
          )
          response.status(204).end()
        } else {
          return response
            .status(401)
            .json({
              error: 'token invalid'
            })
        }
      } catch (exception) {
        response.status(400).end()
      }
    } catch (exception) {
      response.status(400).end()
    }
  }
)

module.exports = blogsRouter
