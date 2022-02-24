import express from "express";
import {
	handleGetFeedbacks,
	handlePostFeedback,
} from "../controllers/feedbacks";
import { validateRequest } from "../middleware/validateRequest";
import { validateFeedback } from "../models/feedback";

const router = express.Router();
router.route("/").get(handleGetFeedbacks);
router.post("/", validateRequest(validateFeedback), handlePostFeedback);

export { router as feedbacks };
