import type { NextFunction, Request, Response } from "express";
import { pool } from "../db/pool.js";

/**
 * Validates X-Clinic-Api-Key against the clinic in the path (:id or :clinic_id).
 * Interview-basic: plaintext key in DB. Prod would hash keys + rotate.
 */
export async function clinicAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.header("X-Clinic-Api-Key");
  if (!apiKey) {
    res.status(401).json({ message: "Missing X-Clinic-Api-Key header" });
    return;
  }

  const clinicId = Number(req.params.id ?? req.params.clinic_id);
  if (!Number.isFinite(clinicId)) {
    res.status(400).json({ message: "Invalid clinic id" });
    return;
  }

  const result = await pool.query(
    "SELECT clinic_id FROM clinic WHERE clinic_id = $1 AND api_key = $2",
    [clinicId, apiKey],
  );

  if (result.rows.length === 0) {
    res.status(401).json({ message: "Invalid API key for this clinic" });
    return;
  }

  next();
}
