const blogRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (e) {
    console.log(e)
    response.status(500)
  }
})

blogRouter.post('/', async (request, response) => {
  // const blog = new Blog(request.body)
  body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url || "",
    likes: body.likes || 0,
  })

  if (!blog.title || !blog.author) {
    response.status(400).json({})
    return
  }

  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (e) {
    console.log(e)
    response.status(500)
  }
})

blogRouter.delete('/:id', async (request, response) => {
  try {
    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).json(result)
  } catch (e) {
    console.log(e)
    response.status(500)
  }
})

blogRouter.put('/:id', async (request, response) => {
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
    console.log(e)
    response.status(500)
  }
})

module.exports = blogRouter
