import { Router } from "express";
import {
  getAvailableSlotsController,
  createAppointmentController,
  cancelAppointmentController,
} from "../controllers/clinicsController.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const router = Router();

router.get("/:id/available-slots", asyncHandler(getAvailableSlotsController));

router.post("/:id/book", asyncHandler(createAppointmentController));

router.delete(
  "/:clinic_id/appointments/:appointment_id",
  asyncHandler(cancelAppointmentController),
);

export const clinicsRouter = router;
