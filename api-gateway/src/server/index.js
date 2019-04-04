const express = require("express");
const api = require("../api");
const passport = require("../security/passport");
const createMiddleware = require("swagger-express-middleware");

const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../../swagger");

const start = container => {
  return new Promise((resolve, reject) => {
    const { port } = container.resolve("serverSettings");

    if (!port) {
      reject(new Error("The server must be started with an available port"));
    }

    const app = express();
    app.use(express.json());

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    createMiddleware(swaggerDoc, app, function(err, middleware) {
      if (err) {
        reject(err);
      }

      app.use(
        middleware.metadata(),
        middleware.parseRequest(),
        middleware.validateRequest()
      );

      passport(container);
      api(app, container);

      // Add a custom error handler that returns errors as HTML
      app.use((err, req, res, next) => {
        res.status(err.status);
        res.send(err.message.replace(/\\n/g, '\n'));
      });

      const server = app.listen(port, () => resolve(server));
    });
  });
};

module.exports = Object.assign({}, { start });
