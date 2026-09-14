import type { Request, Response } from "express";
import { listAvailableSlots } from "../services/clinicsService.js";

export async function getAvailableSlotsController(req: Request, res: Response) {
  const { id } = req.params;
  const date = req.query.date;
  const slots = await listAvailableSlots(Number(id), String(date));
  res.json(slots);
}
