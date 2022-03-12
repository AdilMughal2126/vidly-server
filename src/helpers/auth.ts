/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcryptjs";
import DataURIParser from "datauri/parser";
// import dotenv from "dotenv";
import { Request } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { JwtPayload } from "../types/JwtPayload";
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
		},
		process.env.JWT_PRIVATE_KEY as string
	);
	return token;
};

export const getToken = (req: Request) => req.header("X-Auth-Token");

export const verifyToken = (token: string): string | JwtPayload =>
	jwt.verify(token, process.env.JWT_PRIVATE_KEY!);

export const generateHash = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

export const validateHash = async (password: string, hash: string) =>
	await bcrypt.compare(password, hash);

const dUri = new DataURIParser();

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 * @see {@link https://medium.com/@joeokpus/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54}
 */

export const dataUri = (req: Request) =>
	dUri.format(
		path.extname(req.file!.originalname).toString(),
		req.file!.buffer
	);
