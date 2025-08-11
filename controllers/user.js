const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (e) {
    console.log(e)
    response.status(500)
  }
})

usersRouter.get('/', async (_, response) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (e) {
    console.log(e)
    response.status(500)
  }
})

module.exports = usersRouter
