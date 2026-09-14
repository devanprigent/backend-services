import { Router } from "express";
import { getAvailableSlotsController } from "../controllers/clinicsController.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const router = Router();

router.get("/:id/available-slots", asyncHandler(getAvailableSlotsController));

export const clinicsRouter = router;
