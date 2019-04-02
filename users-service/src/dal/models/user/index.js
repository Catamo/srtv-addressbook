let Schema = require("mongoose").Schema;
let SchemaObjectId = Schema.Types.ObjectId;

let UserSchema = Schema({
  id: SchemaObjectId,
  email: String,
  password: String
});

module.exports = UserSchema;
