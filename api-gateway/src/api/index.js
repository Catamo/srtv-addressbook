const authentication = require("./authentication");
const users = require("./users");

module.exports = (app, container) => {
  authentication(app, container);
  users(app, container);
};
