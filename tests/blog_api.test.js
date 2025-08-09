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

})

after(async () => {
  await mongoose.connection.close()
})

