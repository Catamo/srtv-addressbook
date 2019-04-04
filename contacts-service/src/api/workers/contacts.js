const { addQueueConsumer } = require("srtv-amqp-utils").ServerUtils;

module.exports = (workerChannel, repo) => {
  addQueueConsumer(workerChannel, "contacts.create", (msg, callback) => {
    const contact = {
      name: msg.name,
      surname: msg.surname,
      email: msg.email,
      phoneNumber: msg.phoneNumber
    };

    repo.addContact(contact).then(contact => {
      callback(contact);
    });
  });
};