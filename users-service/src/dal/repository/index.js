const { User } = require("../models");
const { encrypt, compareHash } = require("srtv-encryption");

const repository = connection => {
  const registerUser = user => {
    return new Promise((resolve, reject) => {
      const sendUser = (err, user) => {
        if (err) {
          reject(
            new Error(
              `An error occured while creating the new user, err: ${err}`
            )
          );
        }
        resolve(user);
      };

      encrypt(user.password).then(hash => {
        let newUser = new User(user);
        newUser.password = hash;
        newUser.save(sendUser);
      });
    });
  };

  const verifyUserCredentials = userCredentials => {
    return new Promise((resolve, reject) => {
      const verifyUser = (err, user) => {
        if (err) {
          reject(
            new Error(
              `An error occured while verifying the user credentials, err: ${err}`
            )
          );
        }

        compareHash(userCredentials.password, user.password).then(match => {
          resolve(match);
        });
      };

      User.findOne({ email: userCredentials.email }, verifyUser);
    });
  };

  const disconnect = () => {
    connection.disconnect();
  };

  return Object.create({
    registerUser,
    verifyUserCredentials,
    disconnect
  });
};

const connect = connection => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error("connection was not supplied!"));
    }
    resolve(repository(connection));
  });
};

module.exports = Object.assign({}, { connect });
