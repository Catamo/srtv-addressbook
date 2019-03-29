const serverSettings = {
  port: process.env.PORT || 5000
}

const authSettings = {
  usersServiceUrl: process.env.USER_SERVICE_URL,
  tokenExpirationMilliseconds: 30,
  tokenSecret: process.env.JWT_SECRET
}

const serviceProxies = {
  usersServiceProxies: [{
    route: "/users",
    target: process.env.USER_SERVICE_URL
  }],
  contactServiceProxies: [{
    route: "/contacts",
    target: process.env.CONTACTS_SERVICE_URL
  }]
}

module.exports = Object.assign({}, { serverSettings, authSettings, serviceProxies })
