const amqp = require('amqplib/callback_api')

const consumerCallback = (channel, msg, result) => {
  channel.sendToQueue(msg.properties.replyTo,
    new Buffer(JSON.stringify(result)),
    {correlationId: msg.properties.correlationId})
}

const workerChannelWrapper = (channel) => {
  return {
    addQueueConsumer: (queueName, method) => {
      channel.assertQueue(queueName, {durable: false})
      channel.prefetch(1)
      channel.consume(queueName, (msg) => method(msg, (result) => consumerCallback(channel, msg, result)))
    }
  }
}

const createWorkerChannel = (settings) => new Promise((resolve, reject) => {
  console.log(settings)
  amqp.connect(settings.url, (connErr, conn) => {
    if (connErr) {
      reject(connErr)
    }
    console.log('CONNECTING', connErr, conn)
    conn.createChannel((channelErr, channel) => {
      if (channelErr) {
        reject(channelErr)
      }
      resolve(workerChannelWrapper(channel))
    })
  })
})

module.exports = Object.assign({}, {createWorkerChannel})
