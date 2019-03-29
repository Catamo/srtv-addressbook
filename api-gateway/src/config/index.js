const {serverSettings, authSettings, serviceProxies} = require('./config')
const {initDI} = require('./di')
const init = initDI.bind(null, {serverSettings, authSettings, serviceProxies})

module.exports = Object.assign({}, {init})
