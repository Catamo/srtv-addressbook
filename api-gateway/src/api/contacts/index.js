const status = require("http-status");
const passport = require("passport");
const { sendRPCMessage } = require("srtv-amqp-utils").ClientUtils;

module.exports = (app, container) => {
  const amqpChannel = container.resolve("amqpChannel");
  const amqpQueues = container.resolve("amqpQueues");

  app.post(
    "/contacts",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
      let contact = JSON.stringify({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        relatedUserEmail: req.userEmail
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
