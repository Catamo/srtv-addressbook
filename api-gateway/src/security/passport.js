const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const amqpClient = require('../amqp/client')

module.exports = (container) => {
  const { tokenSecret } = container.resolve('authSettings')

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (username, password, done) => {
    let userCredentials = { email: username, password }

    amqpClient.createClient({ url: 'amqp://rabbitmq:5672' })
      .then(ch => {
        amqpClient
          .sendRPCMessage(ch, JSON.stringify(userCredentials), 'users.validate')
          .then((msg) => {
            let { userVerified } = JSON.parse(msg)
            if (userVerified) {
              return done(null, userCredentials)
            } else {
              return done('Incorrect Username / Password')
            }
          })
          .catch((error) => {
            console.log(error)
            done(error)
          })
      })
  }))

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: tokenSecret
  },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done('jwt expired')
      }

      return done(null, jwtPayload)
    }
  ))
}
