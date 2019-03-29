'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  app.post('/users', (req, res, next) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    }

    repo.registerUser(user).then((user) => {
      res.status(status.OK).json(user)
    }).catch(next)
  })

  app.post('/user-authentication', (req, res, next) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    }

    repo.verifyUserCredentials(user).then((userVerified) => {
      if (userVerified) {
        res.status(status.OK)
      } else {
        res.status(status.UNAUTHORIZED)
      }
    }).catch(next)
  })
}
