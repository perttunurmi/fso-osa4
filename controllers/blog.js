const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
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
  } else {
    blog.save().then((result) => {
      response.status(201).json(result)
    })
  }
})


module.exports = blogRouter
