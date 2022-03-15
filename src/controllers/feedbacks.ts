import { Request, Response } from "express";
import { getToken, verifyToken } from "../helpers/auth";
import { asyncMiddleware } from "../middleware/async";
import { Feedback } from "../models/feedback";
import { FeedbackType } from "../types/FeedbackType";
import { JwtPayload } from "../types/JwtPayload";
import { Params } from "../types/ParamsType";

export const handleGetFeedbacks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const feedbacks = await Feedback.find();
		return res.json(feedbacks);
	}
);

export const handlePostFeedback = asyncMiddleware(
	async (req: Request<Params, unknown, FeedbackType>, res: Response) => {
		const token = getToken(req);
		let user: JwtPayload;

		token ? (user = verifyToken(token) as JwtPayload) : (user = {});

		const { subject, message } = req.body;
		await Feedback.create({
			subject,
			message,
			username: user?.name,
			email: user?.email,
		});
		return res.json("Thanks for your feedback!");
	}
);
