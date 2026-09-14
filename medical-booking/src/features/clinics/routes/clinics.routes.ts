import { Router } from "express";
import { getAvailableSlotsController } from "../controllers/clinicsController.js";

const router = Router();

router.get("/:id/available-slots", getAvailableSlotsController);

export const clinicsRouter = router;
