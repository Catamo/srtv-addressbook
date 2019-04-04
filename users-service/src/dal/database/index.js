const mongoose = require("mongoose");

const connect = (options, mediator) => {
  mediator.once("boot.ready", () => {
    let connOpt = {};

    if (process.env.ENV !== "TEST") {
      connOpt.useNewUrlParser = true;
    }

    mongoose.connect(options.serverUrl, connOpt);

    const conn = mongoose.connection;

    conn.on("error", err => {
      mediator.emit("db.error", err);
    });

    conn.on("open", () => {
      mediator.emit("db.ready", conn);
    });
  });
};

module.exports = Object.assign({}, { connect });
