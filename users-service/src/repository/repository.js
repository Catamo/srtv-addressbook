'use strict'
const { User } = require('../mongo/models/')

const repository = (connection) => {
  const getAllUsers = () => {
    return new Promise((resolve, reject) => {
      const users = []
      const cursor = User.find({})
      const addUser = (user) => {
        users.push(user)
      }
      const sendUsers = (err) => {
        if (err) {
          reject(new Error('An error occured fetching all users, err:' + err))
        }
        resolve(users.slice())
      }
      cursor.forEach(addUser, sendUsers)
    })
  }

  const getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sendUser = (err, user) => {
        if (err) {
          reject(new Error(`An error occured fetching a user with id: ${id}, err: ${err}`))
        }
        resolve(user)
      }

      User.findById(id, sendUser)
    })
  }

  const addUser = (user) => {
    return new Promise((resolve, reject) => {
      const sendUser = (err, user) => {
        if (err) {
          reject(new Error(`An error occured while creating the new user, err: ${err}`))
        }
        resolve(user)
      }

      let newUser = new User(user)
      newUser.save(sendUser)
    })
  }

  const updateUser = () => {
    return null
  }

  const disconnect = () => {
    connection.disconnect()
  }

  return Object.create({
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    disconnect
  })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection was not supplied!'))
    }
    resolve(repository(connection))
  })
}

module.exports = Object.assign({}, {connect})
