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
        
        console.log('login', errLogin, user);
        if (errLogin) {
          res.status(status.BAD_REQUEST).send({ error: errLogin });
          return;
        }

        console.log('login - preToken', errLogin, user);
        const token = jwt.sign({ email: user.email }, tokenSecret, {
          expiresIn: tokenExpirationSeconds
        });
        console.log('token', token)
        res.status(status.OK).json({ userEmail: user.email, token });
      });
    })(req, res);
  });
};
