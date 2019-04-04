const status = require("http-status");
const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports = (app, container) => {
  const { tokenExpirationSeconds, tokenSecret } = container.resolve(
    "authSettings"
  );

  app.post("/authentication", (req, res, next) => {
    passport.authenticate("local", { session: false }, (errAuth, user) => {
      if (errAuth || !user) {
        res.status(status.BAD_REQUEST).json({ errAuth });
        return;
      }

      const payload = {
        username: user.email
      };
      req.login(payload, { session: false }, errLogin => {
        
        if (errLogin) {
          res.status(status.BAD_REQUEST).send({ error: errLogin });
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
