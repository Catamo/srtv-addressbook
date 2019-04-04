const status = require("http-status");
const { sendRPCMessage } = require("srtv-amqp-utils").ClientUtils;

module.exports = (app, container) => {
  const amqpChannel = container.resolve("amqpChannel");
  const amqpQueues = container.resolve("amqpQueues");

  app.post("/users", (req, res, next) => {
    let user = JSON.stringify({
      email: req.body.email,
      password: req.body.password
    });

    sendRPCMessage(amqpChannel, user, amqpQueues.userRegisterQueue).then(
      msg => {
        const { err, result } = JSON.parse(msg);
        if (err) {
          res.status(status.UNPROCESSABLE_ENTITY).json({ error: err });
          return;
        }
        res.status(status.CREATED).json(result);
      }
    );
  });
};
