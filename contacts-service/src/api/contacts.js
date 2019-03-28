'use strict'
const status = require('http-status')

module.exports = (app, options) => {
  const {repo} = options

  app.post('/contacts', (req, res, next) => {
    const contact = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber
    }

    repo.addContact(contact).then((contact) => {
      res.status(status.OK).json(contact)
    }).catch(next)
  })
}
