'use strict'
const express = require('express')
const proxy = require('http-proxy-middleware')
const spdy = require('spdy')
const serviceProxies = require('../../service-proxies.json')

const start = (container) => {
  return new Promise((resolve, reject) => {
    const {port, ssl} = container.resolve('serverSettings')

    if (!serviceProxies) {
      reject(new Error('The server must be started with services proxies'))
    }
    if (!port) {
      reject(new Error('The server must be started with an available port'))
    }

    const app = express()

    for (let serviceProxy of serviceProxies) {
      const {route, target} = serviceProxy

      app.use(route, proxy({
        target,
        changeOrigin: true,
        logLevel: 'debug'
      }))
    }

    if (process.env.NODE === 'test') {
      const server = app.listen(port, () => resolve(server))
    } else {
      // const server = spdy.createServer(ssl, app)
      //   .listen(port, () => resolve(server))
      
      const server = app.listen(port, () => resolve(server))
    }
  })
}

module.exports = Object.assign({}, {start})
