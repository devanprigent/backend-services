import { Router } from "express";
import {
  getAvailableSlotsController,
  createAppointmentController,
  cancelAppointmentController,
} from "../controllers/clinicsController.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { clinicAuth } from "../../../plugins/auth.js";

const router = Router();

router.use("/:id", asyncHandler(clinicAuth));

router.get("/:id/available-slots", asyncHandler(getAvailableSlotsController));

router.post("/:id/book", asyncHandler(createAppointmentController));

router.delete(
  "/:id/appointments/:appointment_id",
  asyncHandler(cancelAppointmentController),
);

export const clinicsRouter = router;
