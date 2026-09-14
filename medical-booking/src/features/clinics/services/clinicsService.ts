import { pool } from "../../../db/pool.js";
import createHttpError from "http-errors";

// We assume a clinic has the same opening time and closing time for each day.
// Also we don't consider the break time.
// Time are stored as an integer of the number of minutes past midnight
export async function getClinicRules(id: number) {
  const rules = await pool.query(
    "SELECT opening_time, closing_time, slot_duration FROM clinic WHERE clinic_id = $1",
    [id],
  );
  return rules.rows[0];
}

function getAvailableSlots(
  opening_time: number,
  closing_time: number,
  slot_duration: number,
) {
  const availableSlots = [];
  let slot_index = opening_time;

  while (slot_index + slot_duration <= closing_time) {
    availableSlots.push([slot_index, slot_index + slot_duration]);
    slot_index = slot_index + slot_duration;
  }

  return availableSlots;
}

async function getAppointments(id: number, date: Date) {
  const appointments = await pool.query(
    "SELECT * FROM appointments WHERE clinic_id = $1 AND DATE(start_time) = DATE($2)",
    [id, date],
  );
  return appointments.rows;
}

function getSlotFromTime(start_time: Date): number {
  return start_time.getHours() * 60 + start_time.getMinutes();
}

function detectAvailableSlots(
  allSlots: number[][],
  appointments: { start_time: Date }[],
) {
  const slotsTaken = new Set(
    appointments.map((appointment) => getSlotFromTime(appointment.start_time)),
  );
  return allSlots.filter((slot) => !slotsTaken.has(slot[0]));
}

export async function listAvailableSlots(id: number, date: Date) {
  const rules = await getClinicRules(id);
  const allSlots = getAvailableSlots(
    rules.opening_time,
    rules.closing_time,
    rules.slot_duration,
  );
  const appointments = await getAppointments(id, date);
  const availableSlots = detectAvailableSlots(allSlots, appointments);
  return availableSlots;
}

async function checkSlotAvailable(clinic_id: number, start_time: Date) {
  const availableSlots = await listAvailableSlots(clinic_id, start_time);
  const availableStartTime = availableSlots.map((slot) => slot[0]);

  const requiredSlot = getSlotFromTime(start_time);

  if (!availableStartTime.includes(requiredSlot)) {
    throw createHttpError(
      409,
      `Slot is already taken at clinic_id: ${clinic_id} for start_time: ${start_time}`,
    );
  }
}

async function getClinic(clinic_id: number) {
  const clinic = await pool.query("SELECT * FROM clinic WHERE clinic_id = $1", [
    clinic_id,
  ]);
  return clinic.rows;
}

async function getPatient(patient_id: number) {
  const patient = await pool.query(
    "SELECT * FROM patient WHERE patient_id = $1",
    [patient_id],
  );
  return patient.rows;
}

export async function createAppointment(
  clinic_id: number,
  patient_id: number,
  start_time: Date,
  appointment_type: string,
) {
  const patient = await getPatient(patient_id);
  if (patient.length === 0) {
    throw createHttpError(404, `Patient not found: ${patient_id}`);
  }

  const clinic = await getClinic(clinic_id);
  if (clinic.length === 0) {
    throw createHttpError(404, `Clinic not found: ${clinic_id}`);
  }

  await checkSlotAvailable(clinic_id, start_time);

  const newAppointment = await pool.query(
    "INSERT INTO appointments (patient_id, clinic_id, start_time, appointment_type) VALUES ($1,$2,$3,$4) RETURNING *",
    [patient_id, clinic_id, start_time, appointment_type],
  );

  return newAppointment.rows[0];
}
