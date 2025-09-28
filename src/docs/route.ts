import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

export default function docs(app: Express) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOutput, {
      customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css",
      customJs: ["https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js", "https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-standalone-preset.js"],
    })
  );
}
