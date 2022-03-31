import { Request, Response } from "express";
import { getToken, verifyToken } from "../helpers/auth";
import { FeedbackInt } from "../interfaces/FeedbackInt";
import { JwtPayloadInt } from "../interfaces/JwtPayloadInt";
import { ParamsInt } from "../interfaces/ParamsInt";
import { asyncMiddleware } from "../middleware/async";
import { Feedback } from "../models/feedback";

export const handleGetFeedbacks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const feedbacks = await Feedback.find();
		return res.json(feedbacks);
	}
);

export const handlePostFeedback = asyncMiddleware(
	async (req: Request<ParamsInt, unknown, FeedbackInt>, res: Response) => {
		let user: JwtPayloadInt;
		const token = getToken(req);

		token === "null"
			? (user = {})
			: (user = verifyToken(token as string) as JwtPayloadInt);

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
