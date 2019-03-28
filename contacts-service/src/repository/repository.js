'use strict'
const repository = (db) => {
  const collection = db.collection('contacts')

  const addContact = (contact) => {
    return new Promise((resolve, reject) => {
      collection
        .add(contact)
        .then((docRef) => {
            contact.id = docRef.id
            resolve(contact)
        })
        .catch((error) => {
            reject(new Error('An error occured while creating the contact, err:' + error))
        });
    })
  }

  return Object.create({
    addContact
  })
}

const connect = (db) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('db was not supplied!'))
    }
    resolve(repository(db))
  })
}

module.exports = Object.assign({}, {connect})
