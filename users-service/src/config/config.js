const dbSettings = {
  server_url: process.env.DB_SERVER_URL
}

const amqpSettings = {
  url: 'amqp://rabbitmq:5672'
}

module.exports = Object.assign({}, { dbSettings, amqpSettings })
