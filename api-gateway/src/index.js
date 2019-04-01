const { EventEmitter } = require("events");
const server = require("./server/server");
const amqp = require("./amqp/amqp.client.utils");
const di = require("./config");
const mediator = new EventEmitter();

console.log("--- API Gateway Service ---");
console.log("Connecting to API repository...");

process.on("uncaughtException", err => {
  console.error("Unhandled Exception", err);
});

process.on("uncaughtRejection", (err, promise) => {
  console.error("Unhandled Rejection", err);
});

mediator.on("di.ready", container => {
  console.log("Connected. Starting Server");
  const amqpSettings = container.resolve("amqpSettings");

  amqp.createClient(amqpSettings).then(amqpChannel => {
    container.registerValue({ amqpChannel });

    return server.start(container).then(app => {
      console.log(
        `Server started succesfully, API Gateway running on port: ${
          container.cradle.serverSettings.port
        }.`
      );
      app.on("close", () => {
        console.log("Server finished");
      });
    });
  });
});

di.init(mediator);

mediator.emit("init");
