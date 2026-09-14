import express from "express";
import { clinicsRouter } from "./features/clinics/routes/clinics.routes.js";

export function buildApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/clinics", clinicsRouter);

  return app;
}
