const contactsWorkers = require("./workers/contacts");
const serverHelpers = require("./amqp.server.utils");

module.exports = (settings, repo) => {
  serverHelpers.createChannel(settings).then(channel => {
    contactsWorkers(channel, repo);
  });
};
