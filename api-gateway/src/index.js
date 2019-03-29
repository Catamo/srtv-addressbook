'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const di = require('./config')
const mediator = new EventEmitter()

console.log('--- API Gateway Service ---')
console.log('Connecting to API repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('di.ready', (container) => {
  console.log('Connected. Starting Server')

  return server
    .start(container)
    .then(app => {
      console.log(`Server started succesfully, API Gateway running on port: ${container.cradle.serverSettings.port}.`)
    })
})

di.init(mediator)

mediator.emit('init')
