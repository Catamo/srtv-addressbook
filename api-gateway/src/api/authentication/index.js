const status = require("http-status");
const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports = (app, container) => {
  const { tokenExpirationSeconds, tokenSecret } = container.resolve(
    "authSettings"
  );

  app.post("/authentication", (req, res, next) => {
    passport.authenticate("local", { session: false }, (error, user) => {
      if (error || !user) {
        res.status(status.BAD_REQUEST).json({ error });
        return;
      }
      console.log(error, user);
      const payload = {
        username: user.email
      };
      req.login(payload, { session: false }, error => {
        if (error) {
          res.status(status.BAD_REQUEST).send({ error });
          return;
        }

        const token = jwt.sign({ email: user.email }, tokenSecret, {
          expiresIn: tokenExpirationSeconds
        });
        res.status(status.OK).json({ userEmail: user.email, token });
      });
    })(req, res);
  });
};
