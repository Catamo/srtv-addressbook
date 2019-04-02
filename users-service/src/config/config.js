const dbSettings = {
  serverUrl: process.env.DB_SERVER_URL
};

const amqpSettings = {
  url: process.env.BROKER_URL
};

console.log({ dbSettings, amqpSettings })

module.exports = Object.assign({}, { dbSettings, amqpSettings });
