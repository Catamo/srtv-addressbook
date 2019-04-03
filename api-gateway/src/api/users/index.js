const status = require("http-status");
const passport = require("passport");
const amqpClient = require("../../amqp/amqp.client.utils");

module.exports = (app, container) => {
  const amqpChannel = container.resolve("amqpChannel");
  const amqpQueues = container.resolve("amqpQueues");

  app.post("/users", (req, res, next) => {
    let user = {
      email: req.body.email,
      password: req.body.password
    }

    amqpClient
      .sendRPCMessage(
        amqpChannel,
        JSON.stringify(user),
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
      let contact = { 
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
      };
      contact.relatedUserId = req.params.id;

      amqpClient
        .sendRPCMessage(
          amqpChannel,
          JSON.stringify(contact),
          amqpQueues.contactCreateQueue
        )
        .then(msg => {
          const result = JSON.parse(msg);
          res.status(status.CREATED).json(result);
        });
    }
  );
};
