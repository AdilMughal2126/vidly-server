import { Request, Response } from "express";
import { generateAuthToken, generateHash, validateHash } from "../helpers/auth";
import { ParamsInt } from "../interfaces/ParamsInt";
import { UpdatePasswordInt, UserInt } from "../interfaces/UserInt";
import { asyncMiddleware } from "../middleware/async";
import { User } from "../models/user";

export const handleGetUsers = asyncMiddleware(
	async (req: Request, res: Response) => {
		const users = await User.find().sort("name").select("-hash");
		return res.json(users);
	}
);

export const handleGetUser = asyncMiddleware(
	async (req: Request, res: Response) => {
		const user = await User.findById(req.params.id).select("-hash");
		if (!user) return res.status(404).json("User Not Found");
		return res.json(user);
	}
);

export const handleCreateUser = asyncMiddleware(
	async (req: Request<unknown, unknown, UserInt>, res: Response) => {
		const { name, email } = req.body;
		const isEmail = await User.findOne({ email });
		if (isEmail)
			return res.status(400).json("Address email is already registered");
		const hash = await generateHash(req.body.password);
		const user = await User.create({ name, email, hash });
		const token = generateAuthToken(user);
		return res.json(token);
	}
);

export const handleUpdateUser = asyncMiddleware(
	async (req: Request<ParamsInt, unknown, UserInt>, res: Response) => {
		const { name, email } = req.body;
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: { name, email } },
			{ new: true }
		);
		if (!user) return res.status(404).json("User not found");
		const token = generateAuthToken(user);
		return res.json(token);
	}
);

export const handleUpdatePassword = asyncMiddleware(
	async (
		req: Request<ParamsInt, unknown, UpdatePasswordInt>,
		res: Response
	) => {
		const { currentPassword, newPassword } = req.body;
		const user = await User.findById(req.params.id);
		if (!user) return res.status(400).json("User not found");
		const isValid = await validateHash(currentPassword, user?.hash as string);
		if (!isValid) return res.status(400).json("Invalid password");
		const hash = await generateHash(newPassword);
		await User.findByIdAndUpdate(req.params.id, { $set: { hash } });
		return res.json("Password successfully updated");
	}
);

export const handleDeleteUser = asyncMiddleware(
	async (req: Request, res: Response) => {
		const user = await User.findByIdAndRemove(req.params.id);
		if (!user) return res.status(404).json("User not found");
		return res.json(user);
	}
);
