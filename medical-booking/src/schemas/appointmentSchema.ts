import { z } from "zod";

export const appointmentSchema = z.object({
  patient_id: z.number(),
  start_time: z.string().datetime(),
  appointment_type: z.string(),
});

export const timeSchema = z.object({
  start_time: z.string().datetime(),
});
