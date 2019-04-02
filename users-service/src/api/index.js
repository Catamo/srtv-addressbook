const usersWorkers = require("./workers/users");
const { createServiceChannel } = require("srtv-amqp-utils").ServerUtils;

module.exports = (settings, repo) => {
  createServiceChannel(settings).then(channel => {
    usersWorkers(channel, repo);
  });
};
