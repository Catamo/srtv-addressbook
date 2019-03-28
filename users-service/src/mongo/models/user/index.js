let Schema = require('mongoose').Schema
let SchemaObjectId = Schema.Types.ObjectId

let UserSchema = Schema({
  id: SchemaObjectId,
  name: String,
  surname: String,
  email: String,
  password: String
})

module.exports = UserSchema
