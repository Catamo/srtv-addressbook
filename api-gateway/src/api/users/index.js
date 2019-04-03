const status = require("http-status");
const passport = require("passport");
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
        const result = JSON.parse(msg);
        res.status(status.CREATED).json(result);
      }
    );
  });

  app.post(
    "/users/:id/contacts",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      let contact = JSON.stringify({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        relatedUserId: req.params.id
      });

      sendRPCMessage(amqpChannel, contact, amqpQueues.contactCreateQueue).then(
        msg => {
          const result = JSON.parse(msg);
          res.status(status.CREATED).json(result);
        }
      );
    }
  );
};
