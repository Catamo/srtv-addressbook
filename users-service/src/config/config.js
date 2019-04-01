const dbSettings = {
  server_url: process.env.DB_SERVER_URL
};

const amqpSettings = {
  url: process.env.BROKER_URL
};

module.exports = Object.assign({}, { dbSettings, amqpSettings });
