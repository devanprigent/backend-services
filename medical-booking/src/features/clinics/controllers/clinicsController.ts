import type { Request, Response } from "express";
import {
  listAvailableSlots,
  createAppointment,
  cancelAppointment,
} from "../services/clinicsService.js";
import {
  appointmentSchema,
  timeSchema,
} from "../../../schemas/appointmentSchema.js";

export async function getAvailableSlotsController(req: Request, res: Response) {
  const { id } = req.params;
  const { start_time } = timeSchema.parse(req.query);
  const slots = await listAvailableSlots(Number(id), new Date(start_time));
  res.status(200).json(slots);
}

export async function createAppointmentController(req: Request, res: Response) {
  const { id: clinic_id } = req.params;
  const body = appointmentSchema.parse(req.body);
  const patient_id = body.patient_id;
  const start_time = body.start_time;
  const appointment_type = body.appointment_type;
  const appointment = await createAppointment(
    Number(clinic_id),
    Number(patient_id),
    new Date(start_time),
    String(appointment_type),
  );
  res.status(201).json(appointment);
}

export async function cancelAppointmentController(req: Request, res: Response) {
  const { id: clinic_id, appointment_id } = req.params;
  const appointment = await cancelAppointment(
    Number(clinic_id),
    Number(appointment_id),
  );
  res.status(200).json(appointment);
}
