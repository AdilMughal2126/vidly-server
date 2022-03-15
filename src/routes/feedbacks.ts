import express from "express";
import {
	handleGetFeedbacks,
	handlePostFeedback,
} from "../controllers/feedbacks";
import { requireAdmin } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { validateFeedback } from "../models/feedback";

const router = express.Router();
router.get("/", requireAdmin, handleGetFeedbacks);
router.post("/", validateRequest(validateFeedback), handlePostFeedback);

export { router as feedbacks };
