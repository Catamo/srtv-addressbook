'use strict'
const status = require('http-status')
const passport = require('passport')
const jwt = require('jsonwebtoken')

module.exports = (app, container) => {
  const { tokenExpirationMilliseconds, tokenSecret } = container.resolve('authSettings')

  app.post('/authentication', (req, res, next) => {
    passport.authenticate('local', { session: false }, (error, user) => {
      console.log('kjhkjhkh')
      if (error || !user) {
        res.status(status.UNAUTHORIZED).json({ error })
      }
      const payload = {
        username: user.email,
        expires: Date.now() + parseInt(tokenExpirationMilliseconds)
      }
      req.login(payload, {session: false}, (error) => {
        if (error) {
          res.status(status.BAD_REQUEST).send({ error })
        }
        const token = jwt.sign({ email: user.email }, tokenSecret)
        res.status(status.OK).json({ email: user.email, token })
      })
    })(req, res)
  })
}
