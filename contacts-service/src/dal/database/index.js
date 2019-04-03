let admin = require("firebase-admin");

const connect = (options, mediator) => {
  mediator.once("boot.ready", () => {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(options.serviceAccount),
        databaseURL: options.databaseURL
      });

      let db = admin.firestore();
      
      const settings = { timestampsInSnapshots: true}
      db.settings(settings)

      mediator.emit("db.ready", db);
    } catch (err) {
      mediator.emit("db.error", err);
    }
  });
};

module.exports = Object.assign({}, { connect });
