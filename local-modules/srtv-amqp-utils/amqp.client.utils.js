const amqp = require("amqplib");
const EventEmitter = require("events");
const {
  REPLY_QUEUE,
  RETRY_INTERVAL,
  MAX_RETRY_ATTEMPTS
} = require("./amqp.constants");

/**
 * Create amqp channel and return back as a promise.
 * It waits for a reply.
 * @params {String} urlAmqp - rabbit-mq url
 * @returns {Promise} - return amqp channel
 */
const createClientChannel = urlAmqp =>
  new Promise((resolve, reject) => {
    let retriesLeft = MAX_RETRY_ATTEMPTS;

    const connect = () => {
      amqp
        .connect(urlAmqp)
        .then(conn => {
          conn.createChannel().then(channel => {
            channel.responseEmitter = new EventEmitter();
            channel.responseEmitter.setMaxListeners(0);
            channel.consume(
              REPLY_QUEUE,
              msg => {
                channel.responseEmitter.emit(
                  msg.properties.correlationId,
                  msg.content
                );
              },
              { noAck: true }
            );
            resolve(channel);
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
 * Send RPC message to waiting queue and return promise object when
 * event has been emitted from the "consume" function
 * @params {Object} channel - amqp channel
 * @params {String} message - message to send to consumer
 * @params {String} rpcQueue - name of the queue where message will be sent to
 * @returns {Promise} - return msg that send back from consumer
 */
const sendRPCMessage = (channel, message, rpcQueue) =>
  new Promise(resolve => {
    // unique random string
    const correlationId = generateUuid();

    channel.responseEmitter.once(correlationId, resolve);
    channel.sendToQueue(rpcQueue, new Buffer(message), {
      correlationId,
      replyTo: REPLY_QUEUE
    });
  });

// this function will be used to generate random string to use as a correlation ID
function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

module.exports = Object.assign({}, { createClientChannel, sendRPCMessage });
