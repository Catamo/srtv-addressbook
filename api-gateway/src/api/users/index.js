const status = require("http-status");
const passport = require("passport");
const amqpClient = require("../../amqp/amqp.client.utils");

module.exports = (app, container) => {
  const amqpChannel = container.resolve("amqpChannel");
  const amqpQueues = container.resolve("amqpQueues");

  app.post("/users", (req, res, next) => {
    amqpClient
      .sendRPCMessage(
        amqpChannel,
        JSON.stringify(req.body),
        amqpQueues.userRegisterQueue
      )
      .then(msg => {
        const result = JSON.parse(msg);
        res.status(status.CREATED).json(result);
      });
  });

  app.post(
    "/users/:id/contacts",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      let contact = JSON.stringify(req.body);
      contact.ofUser = req.params.id;
      console.log("contacts- ", contact, req.params.id);
      amqpClient
        .sendRPCMessage(amqpChannel, contact, amqpQueues.contactCreateQueue)
        .then(msg => {
          const result = JSON.parse(msg);
          res.status(status.CREATED).json(result);
        });
    }
  );
};
