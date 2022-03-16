import { Request, Response } from "express";
import Joi from "joi";
import { generateAuthToken, validateHash } from "../helpers/auth";
import { asyncMiddleware } from "../middleware/async";
import { User } from "../models/user";
import { UserType } from "../types/UserType";

export const handleAuth = asyncMiddleware(
	async (req: Request<unknown, unknown, UserType>, res: Response) => {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json("Invalid email or password");
		const isValid = await validateHash(password, user.hash as string);
		if (!isValid) return res.status(400).json("Invalid email or password");
		const token = generateAuthToken(user);
		return res.json(token);
	}
);

export const validateAuth = (user: UserType) => {
	const schema = Joi.object({
		email: Joi.string().email().min(8).max(50).required(),
		password: Joi.string().min(8).max(50).required(),
	});

	return schema.validate(user);
};
