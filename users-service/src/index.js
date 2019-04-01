const { EventEmitter } = require("events");
const amqp = require("./amqp");
const repository = require("./repository/repository");
const config = require("./config/");
const mediator = new EventEmitter();

console.log("--- Users Service ---");
console.log("Connecting to users repository...");

process.on("uncaughtException", err => {
  console.error("Unhandled Exception", err);
});

process.on("uncaughtRejection", (err, promise) => {
  console.error("Unhandled Rejection", err);
});

mediator.on("db.ready", db => {
  repository.connect(db).then(connection => {
    console.log("Connected. Starting Users Worker");
    amqp(config.amqpSettings, connection);
  });
});

mediator.on("db.error", err => {
  console.error(err);
});

config.db.connect(config.dbSettings, mediator);

mediator.emit("boot.ready");
