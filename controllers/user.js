const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
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
    next(e)
  }
})

usersRouter.get('/', async (_, response, next) => {
  try {
    const users = await User.find({})
    response.status(200).json(users)
  } catch (e) {
    next(e)
  }
})

module.exports = usersRouter
