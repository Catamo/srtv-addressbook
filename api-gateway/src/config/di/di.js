const { createContainer, asValue } = require('awilix')

function initDI ({serverSettings, authSettings, serviceProxies}, mediator) {
  mediator.once('init', () => {
    const container = createContainer()

    container.register({
      serverSettings: asValue(serverSettings),
      authSettings: asValue(authSettings),
      serviceProxies: asValue(serviceProxies)
    })

    mediator.emit('di.ready', container)
  })
}

module.exports.initDI = initDI
