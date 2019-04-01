const amqpSettings = {
  url: process.env.BROKER_URL
}

const serverSettings = {
  port: process.env.PORT || 5000
}

const authSettings = {
  usersServiceUrl: process.env.USER_SERVICE_URL,
  tokenExpirationMilliseconds: 30,
  tokenSecret: process.env.JWT_SECRET
}

const amqpQueues = {
  userRegisterQueue: 'users.register',
  userValidateCredentialsQueue: 'users.validateCredentials',
  contactCreateQueue: 'contacts.create'
}

module.exports = Object.assign({}, { amqpSettings, serverSettings, authSettings, amqpQueues })
