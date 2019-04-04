const repository = db => {
  const collection = db.collection("contacts");

  const addContact = contact => {
    return new Promise((resolve, reject) => {
      collection
        .add(contact)
        .then(docRef => {
          contact.id = docRef.id;
          resolve(contact);
        })
        .catch(error => {
          reject("An error occured while creating the contact, err:" + error);
        });
    });
  };

  return Object.create({
    addContact
  });
};

const connect = db => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("db was not supplied!");
      return;
    }
    resolve(repository(db));
  });
};

module.exports = Object.assign({}, { connect });
