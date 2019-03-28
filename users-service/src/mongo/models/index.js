let model = require('mongoose').model

let SchemaUser = require('./user')

module.exports = {
  User: model('user', SchemaUser)
}
