const REPLY_QUEUE = "amq.rabbitmq.reply-to";
const RETRY_INTERVAL = 1000;
const MAX_RETRY_ATTEMPTS = 10;

module.exports = Object.assign({}, { REPLY_QUEUE, RETRY_INTERVAL, MAX_RETRY_ATTEMPTS })