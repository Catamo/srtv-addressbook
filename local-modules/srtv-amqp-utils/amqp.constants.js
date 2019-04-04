const REPLY_QUEUE = "amq.rabbitmq.reply-to";
const RETRY_INTERVAL = 1500;
const MAX_RETRY_ATTEMPTS = 16;

module.exports = Object.assign({}, { REPLY_QUEUE, RETRY_INTERVAL, MAX_RETRY_ATTEMPTS })