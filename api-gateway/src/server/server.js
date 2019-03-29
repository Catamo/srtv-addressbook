'use strict'
const express = require('express')
const proxy = require('http-proxy-middleware')
const api = require('../api/authentication')
const passport = require('../security/passport')

const start = (container) => {
  return new Promise((resolve, reject) => {
    const {port} = container.resolve('serverSettings')
    const serviceProxies = container.resolve('serviceProxies')

    if (!serviceProxies) {
      reject(new Error('The server must be started with services proxies'))
    }
    if (!port) {
      reject(new Error('The server must be started with an available port'))
    }

    const app = express()
    app.use(express.json())

    for (let name of Reflect.ownKeys(serviceProxies)) {
      serviceProxies[name].forEach(serviceProxy => {
        let {target, route} = serviceProxy

        app.use(route, proxy({
          target,
          changeOrigin: true
        }))
      })
    }

    // const server = spdy.createServer(ssl, app)
    //   .listen(port, () => resolve(server))
    // passport(container)
    api(app, container)

    const server = app.listen(port, () => resolve(server))
  })
}

module.exports = Object.assign({}, {start})
