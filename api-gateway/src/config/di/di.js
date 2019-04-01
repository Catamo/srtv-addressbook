const { createContainer, asValue } = require("awilix");

const register = (container, key, value) => {
  container.register({
    key: asValue(value)
  });
};

const initDI = (
  { amqpSettings, serverSettings, authSettings, amqpQueues },
  mediator
) => {
  mediator.once("init", () => {
    const container = createContainer();

    container.register({
      amqpSettings: asValue(amqpSettings),
      serverSettings: asValue(serverSettings),
      authSettings: asValue(authSettings),
      amqpQueues: asValue(amqpQueues)
    });

    mediator.emit("di.ready", container);
  });
};

module.exports = Object.assign({}, { initDI, register });
