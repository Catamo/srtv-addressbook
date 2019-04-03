/* eslint-env mocha */
const { EventEmitter } = require("events");
const repository = require("./repository");
const database = require("../config/database");
const { dbSettings } = require("../config/config");

describe("Repository", () => {
  it("should connect with a promise", () => {
    repository.connect({}).should.be.a.Promise();
  });

  it("should register a new user", done => {
    const mediator = new EventEmitter();

    mediator.on("db.ready", db => {
      repository
        .connect(db)
        .then(repo => {
          const user = {
            email: 'test@srtv.com',
            password: 'srtv2019'
          }
          return repo.registerUser(user);
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

    database.connect(dbSettings, mediator);

    mediator.emit("boot.ready");
  });
});
