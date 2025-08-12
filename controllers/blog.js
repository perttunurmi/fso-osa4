require('dotenv')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (_, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
  } catch (e) {
    next(e)
  }
})

const getTokenFrom = request => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }
  return null
}

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json(
      { error: 'missing id for user or it\'s not valid' }
    )
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url || '',
    likes: body.likes || 0,
    user: user.id,
  })

  if (!blog.title || !blog.author) {
    response.status(400).json({})
    return
  }

  try {
    const result = await blog.save()
    user.blogs = user.blogs.concat(result.id)
    await user.save()
    response.status(201).json(result)
  } catch (e) {
    next(e)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).json(result)
  } catch (e) {
    next(e)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
      },
      { runValidators: true },
    )
    response.json(result)
  } catch (e) {
    next(e)
  }
})

module.exports = blogRouter
