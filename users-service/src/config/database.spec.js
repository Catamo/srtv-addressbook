/* eslint-env mocha */
const { EventEmitter } = require("events");
const test = require("assert");
const database = require("./database");
const { dbSettings } = require(".");

describe("Mongo Connection", () => {
  it("should emit db Object with an EventEmitter", done => {
    const mediator = new EventEmitter();

    mediator.on("db.ready", db => {
      db.listCollections().toArray((err, collections) => {
        test.equal(null, err);
        test.ok(collections.length > 0);
        console.log(collections);
        db.disconnect();
        done();
      });
    });

    mediator.on("db.error", err => {
      console.log(err);
    });

    database.connect(dbSettings, mediator);

    mediator.emit("boot.ready");
  });
});
