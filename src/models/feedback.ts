import Joi from "joi";
import { model, Schema } from "mongoose";
import { FeedbackInt } from "../interfaces/FeedbackInt";

export const Feedback = model<FeedbackInt>(
	"Feedback",
	new Schema<FeedbackInt>({
		subject: {
			type: String,
			trim: true,
			required: true,
			maxlength: 300,
		},
		message: {
			type: String,
			trim: true,
			required: true,
			maxlength: 500,
		},
		username: {
			type: String,
			default: null,
		},
		email: {
			type: String,
			default: null,
		},
	})
);

export const validateFeedback = (feedback: FeedbackInt) => {
	const schema = Joi.object({
		subject: Joi.string().trim().max(300).required(),
		message: Joi.string().trim().max(500).required(),
	});

	return schema.validate(feedback);
};
