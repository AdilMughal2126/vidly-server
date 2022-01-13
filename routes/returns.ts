import express from "express";
import { handleReturnedMovie } from "../controllers/returns";
import { requireAuth } from "../middleware/auth";

const router = express.Router();
router.post("/", requireAuth, handleReturnedMovie);

export { router as returns };
