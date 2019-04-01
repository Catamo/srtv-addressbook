const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const amqpClient = require('../amqp/amqp.client.utils')

module.exports = (container) => {
  const { tokenSecret } = container.resolve('authSettings')
  const amqpChannel = container.resolve('amqpChannel')
  const { userValidateCredentialsQueue } = container.resolve('amqpQueues')

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (username, password, done) => {
    let userCredentials = { email: username, password }

    amqpClient
      .sendRPCMessage(amqpChannel, JSON.stringify(userCredentials), userValidateCredentialsQueue)
      .then((msg) => {
        let { userVerified } = JSON.parse(msg)
        if (userVerified) {
          return done(null, userCredentials)
        } else {
          return done('Incorrect Username / Password')
        }
      })
      .catch((error) => {
        done(error)
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
