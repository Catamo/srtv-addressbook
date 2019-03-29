const {serverSettings} = require('./config')
const {initDI} = require('./di')
const init = initDI.bind(null, {serverSettings})

module.exports = Object.assign({}, {init})
