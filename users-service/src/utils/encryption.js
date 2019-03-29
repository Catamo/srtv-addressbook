const bcrypt = require('bcryptjs')

const encrypt = (value) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(parseInt(process.env.HASHING_ROUNDS), (errSalt, salt) => {
      bcrypt.hash(value, salt, (errHash, hash) => {
        if (errHash) {
          reject(new Error('An error occured while encrypting value, err:' + errHash))
        }
        resolve(hash)
      })
    })
  })
}

const compareHash = (value, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(value, hash, (err, match) => {
      if (err) {
        reject(new Error('An error occured while comparing values, err:' + err))
      }
      resolve(match)
    })
  })
}

module.exports = Object.assign({}, { encrypt, compareHash })
