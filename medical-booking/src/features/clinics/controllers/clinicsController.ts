import type { Request, Response } from "express";
import {
  listAvailableSlots,
  createAppointment,
} from "../services/clinicsService.js";
import { appointmentSchema } from "../../../schemas/appointmentSchema.js";

export async function getAvailableSlotsController(req: Request, res: Response) {
  const { id } = req.params;
  const date = req.query.date;
  const slots = await listAvailableSlots(Number(id), String(date));
  res.json(slots);
}

export async function createAppointmentController(req: Request, res: Response) {
  const { id: clinic_id } = req.params;
  appointmentSchema.parse(req.body);
  const patient_id = req.body.patient_id;
  const start_time = req.body.start_time;
  const appointment_type = req.body.appointment_type;
  const appointment = await createAppointment(
    Number(clinic_id),
    Number(patient_id),
    String(start_time),
    String(appointment_type),
  );
  res.json(appointment);
}
