const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { sendRPCMessage } = require("srtv-amqp-utils").ClientUtils;

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
      (username, password, done) => {
        let userCredentials = JSON.stringify({ email: username, password });
        let queueName = userValidateCredentialsQueue;

        sendRPCMessage(amqpChannel, userCredentials, queueName)
          .then(msg => {
            let { err, result } = JSON.parse(msg);

            if (result.userVerified) {
              return done(err, userCredentials);
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
