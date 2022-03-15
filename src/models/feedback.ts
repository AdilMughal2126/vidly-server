import Joi from "joi";
import { model, Schema } from "mongoose";
import { FeedbackType } from "../types/FeedbackType";

export const Feedback = model<FeedbackType>(
	"Feedback",
	new Schema<FeedbackType>({
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

export const validateFeedback = (feedback: FeedbackType) => {
	const schema = Joi.object({
		subject: Joi.string().trim().max(300).required(),
		message: Joi.string().trim().max(500).required(),
	});

	return schema.validate(feedback);
};
