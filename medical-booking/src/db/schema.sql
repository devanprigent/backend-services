-- Your tables, indexes, and constraints (INTERVIEW_EXERCISE.md)
CREATE TABLE clinic (
    clinic_id SERIAL PRIMARY KEY,
    clinic_name VARCHAR(255),
    opening_time INT,
    closing_time INT,
    slot_duration INT
);

CREATE TABLE patient (
    patient_id SERIAL PRIMARY KEY
);

-- We assume an appointment is only one slot
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    clinic_id INT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id)
);
