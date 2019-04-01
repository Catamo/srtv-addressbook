const {
  amqpSettings,
  serverSettings,
  authSettings,
  amqpQueues
} = require("./config");
const { initDI } = require("./di");
const init = initDI.bind(null, {
  amqpSettings,
  serverSettings,
  authSettings,
  amqpQueues
});

module.exports = Object.assign({}, { init });
