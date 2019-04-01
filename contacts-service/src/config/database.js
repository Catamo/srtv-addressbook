let admin = require("firebase-admin");

const connect = (options, mediator) => {
  mediator.once("boot.ready", () => {
    let serviceAccount = require("../../serviceAccountKey.json");

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: options.databaseURL
      });

      let db = admin.firestore();

      mediator.emit("db.ready", db);
    } catch (err) {
      mediator.emit("db.error", err);
    }
  });
};

module.exports = Object.assign({}, { connect });
