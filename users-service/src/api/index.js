const usersWorkers = require("./workers/users");
const { createServerChannel } = require("srtv-amqp-utils").ServerUtils;

module.exports = (settings, repo) => {
  createServerChannel(settings.url).then(channel => {
    usersWorkers(channel, repo);
  });
};
