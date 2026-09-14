import express from "express";
import { clinicsRouter } from "./features/clinics/routes/clinics.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function buildApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    console.log("/health");
    res.json({ status: "ok" });
  });

  app.use("/clinics", clinicsRouter);
  app.use(errorHandler);

  return app;
}
