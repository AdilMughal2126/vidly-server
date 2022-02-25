import bcrypt from "bcryptjs";
// import dotenv from "dotenv";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../types/UserType";

// dotenv.config();

export const generateAuthToken = (user: UserType) => {
	const token = jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			imageUrl: user.imageUrl,
			imageId: user.imageId,
		},
		process.env.JWT_PRIVATE_KEY as string
	);
	return token;
};

export const getToken = (req: Request) => req.header("X-Auth-Token");

export const verifyToken = (token: string) =>
	jwt.verify(token, process.env.JWT_PRIVATE_KEY as string);

export const generateHash = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

export const validateHash = async (password: string, hash: string) =>
	await bcrypt.compare(password, hash);
