const authentication = require("./authentication");
const users = require("./users");
const contacts = require("./contacts");

module.exports = (app, container) => {
  authentication(app, container);
  users(app, container);
  contacts(app, container);
};
