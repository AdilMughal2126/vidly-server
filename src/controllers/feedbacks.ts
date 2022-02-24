import { Request, Response } from "express";
import { asyncMiddleware } from "../middleware/async";
import { Feedback } from "../models/feedback";
import { FeedbackType } from "../types/FeedbackType";

export const handleGetFeedbacks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const feedbacks = await Feedback.find();
		return res.json(feedbacks);
	}
);

export const handlePostFeedback = asyncMiddleware(
	async (req: Request<unknown, unknown, FeedbackType>, res: Response) => {
		const { subject, message } = req.body;
		await Feedback.create({ subject, message });
		return res.json("Thanks for your feedback!");
	}
);
