const contactsWorkers = require("./workers/contacts");
const { createServerChannel } = require("srtv-amqp-utils").ServerUtils;

module.exports = (settings, repo) => {
  createServerChannel(settings.url).then(channel => {
    contactsWorkers(channel, repo);
  });
};
