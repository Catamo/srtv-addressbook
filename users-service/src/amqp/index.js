const amqp = require('amqplib')

module.exports = (repo) => {
  let retriesLeft = 5

  const connect = () => {
    amqp.connect('amqp://rabbitmq:5672')
      .then(conn => {
        conn.createChannel()
          .then(ch => {
            ch.assertQueue('users.validate', { durable: false })
            ch.prefetch(1)
            console.log('users.validate - [x] Awaiting RPC Requests')
            ch.consume('users.validate', msg => {
              console.log('users.validate. msg: ', msg)
              const obj = JSON.parse(msg.content)
              const user = {
                email: obj.email,
                password: obj.password
              }

              repo.verifyUserCredentials(user).then((userVerified) => {
                console.log('userVerified: ', userVerified)
                ch.sendToQueue(msg.properties.replyTo,
                    new Buffer(JSON.stringify({
                      userVerified
                    })),
                    { correlationId: msg.properties.correlationId })
                ch.ack(msg)
              })
            })
          })
      })
      .catch(() => {
        if (retriesLeft > 0) {
          setTimeout(() => {
            retriesLeft -= 1
            connect()
          }, 1000)
        }
      })
  }
  connect()
}
