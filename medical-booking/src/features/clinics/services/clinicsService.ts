import { pool } from "../../../db/pool.js";

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

async function getAppointments(id: number, date: string) {
  const appointments = await pool.query(
    "SELECT * FROM appointments WHERE clinic_id = $1 AND DATE(start_time) = DATE($2)",
    [id, date],
  );
  return appointments.rows;
}

function detectAvailableSlots(
  allSlots: number[][],
  appointments: { start_time: number | Date }[],
) {
  const slotsTaken = new Set(
    appointments.map((appointment) => appointment.start_time),
  );
  return allSlots.filter((slot) => !slotsTaken.has(slot[0]));
}

export async function listAvailableSlots(id: number, date: string) {
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
