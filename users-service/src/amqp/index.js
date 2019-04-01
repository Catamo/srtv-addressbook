const usersWorkers = require("./workers/users");
const serverHelpers = require("./amqp.server.utils");

module.exports = (settings, repo) => {
  serverHelpers.createChannel(settings).then(channel => {
    usersWorkers(channel, repo);
  });
};
