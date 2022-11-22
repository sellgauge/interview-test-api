import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import bodyParser from "body-parser";

import "dotenv/config";
import todo from "./todo";
import auth from "./auth";

const PORT = process.env["PORT"] || 8080;

async function main() {
  const api = express();

  api.use(bodyParser.json());

  api.use((req, res, next) => {
    console.log("%s %s %s", new Date(), req.method, req.url);
    next();
  });

  api.use(
    "/doc",
    swaggerUI.serve,
    swaggerUI.setup(
      swaggerJSDoc({
        swaggerDefinition: {
          openapi: "3.0.0",
          info: {
            title: "Test API",
            version: "1.0.0",
            description: "Test API",
          },
          servers: [
            {
              url: "http://localhost:8080",
              description: "Localhost",
            },
          ],
        },
        apis: ["./src/**/*.ts"],
      })
    )
  );

  api.use("/auth", auth);

  api.use("/todo", todo);

  api.listen(PORT, () => {
    console.log("API is running at *:%s", PORT);
  });
}

main();
