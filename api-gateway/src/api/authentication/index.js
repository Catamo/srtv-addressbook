const status = require("http-status");
const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports = (app, container) => {
  const { tokenExpirationSeconds, tokenSecret } = container.resolve(
    "authSettings"
  );

  app.post(
    "/authentication",
    passport.authenticate("local", { session: false }),
    (req, res) => {
      const payload = { email: req.user.email };

      req.login(payload, { session: false }, errLogin => {
        if (errLogin) {
          res.status(status.BAD_REQUEST).send({ error: errLogin });
          return;
        }

        const token = jwt.sign(payload, tokenSecret, {
          expiresIn: tokenExpirationSeconds
        });
        res.status(status.OK).json({ userEmail: req.user.email, token });
      });
    }
  );
};
