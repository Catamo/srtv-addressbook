const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { sendRPCMessage } = require("srtv-amqp-utils").ClientUtils;
const jwt = require("jsonwebtoken");

module.exports = container => {
  const { tokenSecret } = container.resolve("authSettings");
  const amqpChannel = container.resolve("amqpChannel");
  const { userValidateCredentialsQueue } = container.resolve("amqpQueues");

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      (email, password, done) => {
        const userCredentials = JSON.stringify({ email, password });
        const queueName = userValidateCredentialsQueue;

        sendRPCMessage(amqpChannel, userCredentials, queueName)
          .then(msg => {
            const { err, result } = JSON.parse(msg);

            if (err) {
              return done(err);
            } else if (result.userVerified) {
              return done(null, { email, password: "[hidden]" });
            } else {
              return done("Incorrect Username / Password");
            }
          })
          .catch(error => {
            done(error);
          });
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: tokenSecret,
        passReqToCallback: true
      },
      (req, jwtPayload, done) => {
        req.userEmail = jwtPayload.email;
        return done(null, jwtPayload);
      }
    )
  );
};
