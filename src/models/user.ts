import Joi from "joi";
import { model, Schema } from "mongoose";
import { UserInt } from "../interfaces/UserInt";

const userSchema = new Schema<UserInt>({
	name: {
		type: String,
		trim: true,
		required: true,
		minlength: 5,
		maxlength: 255,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minlength: 8,
		maxlength: 255,
	},
	hash: {
		type: String,
		required: true,
		minlength: 8,
		maxlength: 255,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	imageUrl: {
		type: String,
		default:
			"https://res.cloudinary.com/dafwzsod0/image/upload/v1646766184/vidly/profile/cymfcxo7imebgns0rkp4.jpg",
	},
	imageId: {
		type: String,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
});

export const User = model<UserInt>("User", userSchema);

export const validateUser = (user: UserInt) => {
	const schema = Joi.object({
		name: Joi.string().trim().min(5).max(50).required(),
		password: Joi.string().min(8).max(50).required(),
		email: Joi.string().email().min(8).max(50).required(),
	});

	return schema.validate(user);
};

export const validateUpdatedUser = (user: Pick<UserInt, "name" | "email">) => {
	const schema = Joi.object({
		name: Joi.string().trim().min(5).max(50).required(),
		email: Joi.string().email().min(8).max(50).required(),
	});

	return schema.validate(user);
};
