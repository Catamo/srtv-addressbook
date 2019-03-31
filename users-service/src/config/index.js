const {dbSettings, amqpSettings} = require('./config')
const db = require('./database')

module.exports = Object.assign({}, {dbSettings, amqpSettings, db})
