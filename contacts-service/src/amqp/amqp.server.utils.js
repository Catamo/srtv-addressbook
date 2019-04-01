const amqp = require("amqplib");
const RETRY_INTERVAL = 1000;
const MAX_RETRY_ATTEMPTS = 10;

const createChannel = settings =>
  new Promise((resolve, reject) => {
    let retriesLeft = MAX_RETRY_ATTEMPTS;

    const connect = () => {
      amqp
        .connect(settings.url)
        .then(conn => {
          conn.createChannel().then(ch => {
            resolve(ch);
          });
        })
        .catch(() => {
          if (retriesLeft > 0) {
            setTimeout(() => {
              retriesLeft -= 1;
              connect();
            }, RETRY_INTERVAL);
          } else {
            reject(new Error("Retry attempts exhausted"));
          }
        });
    };
    connect();
  });

const addQueueConsumer = (ch, queueName, consumerMethod) => {
  ch.assertQueue(queueName, { durable: false });
  ch.prefetch(1);
  console.log(queueName + "- Awaiting RPC Requests");
  ch.consume(queueName, msg => {
    let content = JSON.parse(msg.content);
    consumerMethod(content, value => {
      ch.sendToQueue(
        msg.properties.replyTo,
        new Buffer(JSON.stringify(value)),
        { correlationId: msg.properties.correlationId }
      );

      ch.ack(msg);
    });
  });
};

module.exports = Object.assign({}, { createChannel, addQueueConsumer });
