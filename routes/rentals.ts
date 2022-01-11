import express from "express";
import {
  handleCreateRental,
  handleGetRental,
  handleGetRentals,
} from "../controllers/rentals";
import { requireAuth } from "../middleware/auth";

const router = express.Router();
router.route("/").get(handleGetRentals);
router.route("/:id").get(handleGetRental);
router.post("/", requireAuth, handleCreateRental);

export { router as rentals };
