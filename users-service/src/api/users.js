'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  app.get('/users', (req, res, next) => {
    repo.getAllUsers().then(users => {
      res.status(status.OK).json(users)
    }).catch(next)
  })

  app.get('/users/:id', (req, res, next) => {
    repo.getUserById(req.params.id).then(user => {
      res.status(status.OK).json(user)
    }).catch(next)
  })

  app.post('/users', (req, res, next) => {
    const user = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password
    }

    repo.addUser(user).then((user) => {
      res.status(status.OK).json(user)
    }).catch(next)
  })
}
