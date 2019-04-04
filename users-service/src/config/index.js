const dbSettings = {
  serverUrl: process.env.DB_SERVER_URL
};

const amqpSettings = {
  url: process.env.BROKER_URL
};

const encryptionSettings = {
  hashingRounds: process.env.HASHING_ROUNDS
};

module.exports = Object.assign({}, { dbSettings, amqpSettings, encryptionSettings });
