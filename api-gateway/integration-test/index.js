/* eslint-env mocha */
const supertest = require("supertest");
const status = require("http-status");
const { mediator } = require("../src");

mediator.on("app.running", app => {
  describe("API Gateway Service", () => {
    it("POST /users - Created (201) for a successful user registration", done => {
      const api = supertest(app);
      api
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "victor.catamo@register-test.com",
          password: "123123"
        })
        .expect(status.CREATED, done);
    });

    it("POST /users - Unprocessable Entity (422) for a duplicated user email", done => {
      const api = supertest(app);

      api
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "victor.catamo@duplicate-test.com",
          password: "123123"
        })
        .end(() => {
          api
            .post("/users")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send({
              email: "victor.catamo@duplicate-test.com",
              password: "423134"
            })
            .expect(status.UNPROCESSABLE_ENTITY, done);
        });
    });

    it("POST /users - Bad Request (400) for an invalid json schema", done => {
      const api = supertest(app);

      api
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          username: "victor.catamo@register-schema-test.com",
          pass: "123123"
        })
        .expect(status.BAD_REQUEST, done);
    });

    it("POST /authentication - OK (200) when a user successfully logs in", done => {
      const api = supertest(app);

      api
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "victor.catamo@login-test.com",
          password: "423134"
        })
        .end(() => {
          api
            .post("/authentication")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send({
              email: "victor.catamo@login-test.com",
              password: "423134"
            })
            .expect(status.OK, done);
        });
    });

    it("POST /authentication - Bad Request (400) for an invalid json schema", done => {
      const api = supertest(app);

      api
        .post("/authentication")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          username: "victor.catamo@test.com",
          pass: "123123"
        })
        .expect(status.BAD_REQUEST, done);
    });

    it("POST /contacts - Created (201) when a user successfully creates a contact", done => {
      const api = supertest(app);

      api //we create the user
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "victor.catamo@contact-test.com",
          password: "123123"
        })
        .end(() => {
          api //then login
            .post("/authentication")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send({
              email: "victor.catamo@contact-test.com",
              password: "123123"
            })
            .end((err, res) => {
              api //and finally insert the contact
                .post("/contacts")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + res.body.token)
                .send({
                  name: "Victor",
                  surname: "Catamo",
                  email: "victor@outlook.com",
                  phoneNumber: "123123123"
                })
                .expect(status.CREATED, done);
            });
        });
    });

    it("POST /contacts - Bad Request (400) for an invalid json schema", done => {
      const api = supertest(app);

      api //we create the user
        .post("/users")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "victor.catamo@contact-schema-test.com",
          password: "123123"
        })
        .end(() => {
          api //then login
            .post("/authentication")
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
            .send({
              email: "victor.catamo@contact-schema-test.com",
              password: "123123"
            })
            .end((err, res) => {
              api //and finally insert the contact, with bad schema
                .post("/contacts")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", "Bearer " + res.body.token)
                .send({
                  firstname: "Victor",
                  lastname: "Catamo",
                  mainAddress: "victor@outlook.com",
                  phoneNumber: "123123123"
                })
                .expect(status.BAD_REQUEST, done);
            });
        });
    });
  });

  // You must use --delay for `run()` to be available to you.
  run();
});
