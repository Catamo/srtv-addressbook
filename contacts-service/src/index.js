const { EventEmitter } = require("events");
const api = require("./api");
const { repository, database } = require("./dal");
const config = require("./config");
const mediator = new EventEmitter();

console.log("--- Contacts Service ---");
console.log("Connecting to contacts repository...");

process.on("uncaughtException", err => {
  console.error("Unhandled Exception", err);
});

process.on("uncaughtRejection", (err, promise) => {
  console.error("Unhandled Rejection", err);
});

mediator.on("db.ready", db => {
  repository.connect(db).then(repo => {
    console.log("Connected. Starting Server");
    api(config.amqpSettings, repo);
  });
});

mediator.on("db.error", err => {
  console.error(err);
});

database.connect(config.dbSettings, mediator);

mediator.emit("boot.ready");
