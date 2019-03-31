module.exports = (workerChannel, dbConnection) => {
  workerChannel.addQueueConsumer('users.register', (message, callback) => {
    const user = {
      email: message.email,
      password: message.password
    }

    dbConnection.registerUser(user).then((user) => {
      callback(user)
    })
  })

  workerChannel.addQueueConsumer('users.validate', (message, callback) => {
    console.log('users.validate. msg: ', message)
    const user = {
      email: message.email,
      password: message.password
    }

    dbConnection.verifyUserCredentials(user).then((userVerified) => {
      callback(userVerified)
    })
  })
}
