import express from "express";
import {
	handleCreateRental,
	// handleGetRental,
	handleGetRentals,
} from "../controllers/rentals";
import { requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { validateRental } from "../models/rental";

const router = express.Router();
router.get("/", requireAuth, handleGetRentals);
// router.get("/:id", validateId, handleGetRental);
router.post(
	"/",
	[requireAuth, validateRequest(validateRental)],
	handleCreateRental
);

export { router as rentals };
