const { test, after, describe, before, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
app = require('../app.js')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log("Deleted")

  const blogObjects = helper.initialBlogs.map(
    blog => new Blog(blog)
  )

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('Initialized')
})

describe("Blogs api tests", async () => {

  test("Right amount of blogs", async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert.strictEqual(blogs.length, helper.initialBlogs.length)
  })


  test("Blogs contain id", async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach((blog) => {
      assert(blog.id)
    })
  })

  test("Adding a blog", async () => {

    await api.post('/api/blogs').send({
      title: "Test",
      author: "Test",
      url: "Test",
      likes: 0,
    })

    const response = await api.get('/api/blogs')
    const blogs = response.body

    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

  })

  test("Zero likes is the norm", async () => {
    const response = await api.post('/api/blogs').send({
      title: "Test",
      author: "Test",
      url: "Tets",
    })

    newBlog = JSON.parse(response.text)

    assert.strictEqual(newBlog.likes, 0)

  })

  test("A blog must have an title and author", async () => {
    await api.post('/api/blogs').send({
      author: "Test"
    }).expect(400)

    await api.post('/api/blogs').send({
      title: "Test"
    }).expect(400)

    await api.post('/api/blogs').send({}).expect(400)
  })

  test("Delete blog", async () => {
    const blog = await api.post('/api/blogs/').send({
      title: "Test",
      author: "Test",
    })

    await api.delete(`/api/blogs/${blog.body.id}`)
      .expect(204)
  })


  test("Editing existing", async () => {
    const blog = await api.post('/api/blogs/').send({
      title: "Test",
      author: "Test",
    })

    await api.put(`/api/blogs/${blog.body.id}`).send({
      title: blog.body.title,
      author: blog.body.title,
      likes: 1,
    })

    const response = await api.get('/api/blogs/')
    const blogs = response.body
    const edited = blogs.find((obj) => obj.id === blog.body.id)

    assert.deepEqual(edited.likes, 1)
  })

})

after(async () => {
  await mongoose.connection.close()
})
