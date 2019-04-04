/* eslint-env mocha */
const supertest = require("supertest");
const status = require("http-status");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = "1";

const url = "http://api_gateway:5000";

describe("API Gateway Service", () => {
  it("POST /users - Created (201) for a successful user registration", done => {
    const api = supertest(url);
    console.log(`Calling the server ${url}`);

    api
      .post("/users")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        email: "victor.catamo@test.com",
        password: "123123"
      })
      .expect(status.CREATED, done);
  });

  it("POST /users - Bad Request (401) for an invalid json schema", done => {
    const api = supertest(url);
    console.log(`Calling the server ${url}`);

    api
      .post("/users")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username: "victor.catamo@test.com",
        pass: "123123"
      })
      .expect(status.BAD_REQUEST, done);
  });

  it("POST /authentication - OK (200) when a user successfully logs in", done => {
    const api = supertest(url);
    console.log(`Calling the server ${url}`);

    api
      .post("/authentication")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        email: "victor.catamo@test.com",
        password: "123123"
      })
      .expect(status.OK, done);
  });

  it("POST /authentication - Bad Request (401) for an invalid json schema", done => {
    const api = supertest(url);
    console.log(`Calling the server ${url}`);

    api
      .post("/authentication")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        username: "victor.catamo@test.com",
        pass: "123123"
      })
      .expect(status.OK, done);
  });

  it("POST /contacts - OK (200) when a user successfully logs in", done => {
    const api = supertest(url);
    console.log(`Calling the server ${url}`);

    api
      .post("/authentication")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        email: "victor.catamo@test.com",
        password: "123123"
      })
      .expect(status.OK, done);
  });
});
