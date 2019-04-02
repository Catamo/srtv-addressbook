const serverUtils = require("./amqp.server.utils");
const clientUtils = require("./amqp.client.utils");

module.exports = Object.assign(
  {},
  {
    ServerUtils: serverUtils,
    ClientUtils: clientUtils
  }
);
