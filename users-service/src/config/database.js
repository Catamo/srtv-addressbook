const mongoose = require('mongoose')

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    mongoose.connect(
      options.server_url, {
        useNewUrlParser: true
      })

    const conn = mongoose.connection

    conn.on('error', (err) => {
      mediator.emit('db.error', err)
    })

    conn.on('open', () => {
      mediator.emit('db.ready', conn)
    })
  })
}

module.exports = Object.assign({}, {connect})
