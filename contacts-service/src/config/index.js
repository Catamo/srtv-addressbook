const {dbSettings, serverSettings} = require('./config')
const db = require('./database')

module.exports = Object.assign({}, {dbSettings, serverSettings, db})
