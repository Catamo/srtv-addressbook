const { addQueueConsumer } = require("../amqp.server.utils");

module.exports = (workerChannel, repo) => {
  addQueueConsumer(workerChannel, "users.register", (message, callback) => {
    const user = {
      email: message.email,
      password: message.password
    };

    repo.registerUser(user).then(user => {
      callback(user);
    });
  });

  addQueueConsumer(
    workerChannel,
    "users.validateCredentials",
    (message, callback) => {
      const user = {
        email: message.email,
        password: message.password
      };

      repo.verifyUserCredentials(user).then(userVerified => {
        callback({ userVerified });
      });
    }
  );
};
