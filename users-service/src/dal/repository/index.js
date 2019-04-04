const { User } = require("./mongoose-models");
const { encrypt, compareHash } = require("srtv-encryption");

const repository = (connection, encryptionOptions) => {
  const registerUser = user =>
    new Promise((resolve, reject) => {
      const sendUser = (err, user) => {
        if (err) {
          reject(`An error occured while creating the new user, err: ${err}`);
          return;
        }
        user.password = "[hidden]";
        resolve(user);
      };

      User.findOne({ email: user.email }).then(dbUser => {
        if (dbUser) {
          reject("The email entered is already registered");
          return;
        }
        encrypt(user.password, parseInt(encryptionOptions.hashingRounds)).then(
          hash => {
            let newUser = new User(user);
            newUser.password = hash;
            newUser.save(sendUser);
          }
        );
      });
    });

  const verifyUserCredentials = userCredentials =>
    new Promise((resolve, reject) => {
      const verifyUser = (err, user) => {
        if (err) {
          reject(
            `An error occured while verifying the user credentials, err: ${err}`
          );
        }

        compareHash(userCredentials.password, user.password).then(match => {
          resolve(match);
        });
      };

      User.findOne({ email: userCredentials.email }, verifyUser);
    });

  const disconnect = () => {
    connection.disconnect();
  };

  return Object.create({
    registerUser,
    verifyUserCredentials,
    disconnect
  });
};

const connect = (connection, encryptionOptions) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject("connection was not supplied!");
    }
    resolve(repository(connection, encryptionOptions));
  });
};

module.exports = Object.assign({}, { connect });
