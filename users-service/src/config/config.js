const dbSettings = {
  server_url: process.env.DB_SERVER_URL
}

const serverSettings = {
  port: process.env.PORT || 3000
}

module.exports = Object.assign({}, { dbSettings, serverSettings })
