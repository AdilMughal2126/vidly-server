import express from "express";
import {
  handleCreateRental,
  handleGetRental,
  handleGetRentals,
} from "../controllers/rentals";
import { requireAuth } from "../middleware/auth";
import { validateRental } from "../models/rental";
import { validateId } from "../middleware/validateObjectId";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();
router.route("/").get(handleGetRentals);
router.get("/:id", validateId, handleGetRental);
router.post(
  "/",
  [requireAuth, validateRequest(validateRental)],
  handleCreateRental
);

export { router as rentals };
