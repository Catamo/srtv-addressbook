const express = require("express");
const api = require("../api");
const passport = require("../security/passport");

const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../../swagger.json");

const start = container => {
  return new Promise((resolve, reject) => {
    const { port } = container.resolve("serverSettings");

    if (!port) {
      reject(new Error("The server must be started with an available port"));
    }

    const app = express();

    app.use(express.json());

    // const server = spdy.createServer(ssl, app)
    //   .listen(port, () => resolve(server))
    passport(container);
    api(app, container);

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    const server = app.listen(port, () => resolve(server));
  });
};

module.exports = Object.assign({}, { start });
