import { Router } from "express";
import {
  getAvailableSlotsController,
  createAppointmentController,
} from "../controllers/clinicsController.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const router = Router();

router.get("/:id/available-slots", asyncHandler(getAvailableSlotsController));

router.post("/:id/book", asyncHandler(createAppointmentController));

export const clinicsRouter = router;
