const amqp = require("amqplib");
const { RETRY_INTERVAL, MAX_RETRY_ATTEMPTS } = require("./amqp.constants");

/**
 * Create amqp channel and return back as a promise.
 * This channel does not wait for responses.
 * @params {String} urlAmqp - rabbit-mq url
 * @returns {Promise} - return amqp channel
 */
const createServerChannel = urlAmqp =>
  new Promise((resolve, reject) => {
    let retriesLeft = MAX_RETRY_ATTEMPTS;

    const connect = () => {
      amqp
        .connect(urlAmqp)
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

/**
 * This callback type is called `consumerCallback` and is displayed as a global symbol.
 *
 * @callback consumerCallback
 * @param {Object} value
 */

/**
 * This callback type is called `consumerMethod` and is displayed as a global symbol.
 *
 * @callback consumerMethod
 * @param {Object} msg
 * @param {consumerCallback} callback
 */

/**
 * Creates a new consumer for a queue, and in case that the callback is called
 * it returns a value to the client
 * @params {Object} ch - amqp channel
 * @params {String} queueName - name of the queue to consume
 * @params {consumerMethod} consumerMethod - the method to process the message of the queue
 */
const addQueueConsumer = (ch, queueName, consumerMethod) => {
  ch.assertQueue(queueName, { durable: false });
  ch.prefetch(1);
  console.log(queueName + "- Awaiting RPC Requests");

  //It adds or subscribe the queue and executes the consumer
  //method when a message is found
  ch.consume(queueName, msg => {
    //the parsing/stringify logic is centralized
    let content = JSON.parse(msg.content);
    consumerMethod(content, (err, result) => {
      //when the callback is executed it sends the argument
      //to the replyTo queue, where the client awaits a response
      ch.sendToQueue(
        msg.properties.replyTo,
        new Buffer(JSON.stringify({err, result})),
        { correlationId: msg.properties.correlationId }
      );

      ch.ack(msg);
    });
  });
};

module.exports = Object.assign({}, { createServerChannel, addQueueConsumer });
