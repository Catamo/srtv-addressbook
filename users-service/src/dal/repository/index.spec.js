/* eslint-env mocha */
const { EventEmitter } = require("events");
const repository = require("./repository");
const mongo = require("../config/mongo");
const { dbSettings } = require("../config/config");

describe("Repository", () => {
  it("should connect with a promise", () => {
    repository.connect({}).should.be.a.Promise();
  });

  it("should get user by id", done => {
    const mediator = new EventEmitter();

    mediator.on("db.ready", db => {
      repository
        .connect(db)
        .then(repo => {
          return repo.getUserById("1");
        })
        .then(user => {
          console.log(user);
          db.close();
          done();
        })
        .catch(err => {
          console.log(err);
          db.close();
          done();
        });
    });

    mediator.on("db.error", err => {
      console.log(err);
    });

    mongo.connect(dbSettings, mediator);

    mediator.emit("boot.ready");
  });
});
