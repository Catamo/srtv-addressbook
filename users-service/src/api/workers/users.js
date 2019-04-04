const { addQueueConsumer } = require("srtv-amqp-utils").ServerUtils;

module.exports = (workerChannel, repo) => {
  addQueueConsumer(workerChannel, "users.register", (message, callback) => {
    const user = {
      email: message.email,
      password: message.password
    };

    repo
      .registerUser(user)
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
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

      repo
        .verifyUserCredentials(user)
        .then(userVerified => {
          callback(null, { userVerified });
        })
        .catch(err => {
          callback(err);
        });
    }
  );
};
