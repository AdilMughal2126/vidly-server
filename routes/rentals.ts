import express from "express";
import {
  handleCreateRental,
  handleGetRental,
  handleGetRentals,
} from "../controllers/rentals";
import { requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";

const router = express.Router();
router.route("/").get(handleGetRentals);
router.get("/:id", validateId, handleGetRental);
router.post("/", requireAuth, handleCreateRental);

export { router as rentals };
