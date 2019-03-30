const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const axios = require('axios')

module.exports = (container) => {
  const { usersServiceUrl, tokenSecret } = container.resolve('authSettings')

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (username, password, done) => {
    let userCredentials = { email: username, password }

    axios.post(usersServiceUrl + '/user-authentication', userCredentials).then((result) => {
      let { userVerified } = result.data

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
