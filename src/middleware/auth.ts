import cloudinary from "cloudinary";
import DataURIParser from "datauri/parser";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { getToken, verifyToken } from "../helpers/auth";

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = getToken(req);
	if (!token) return res.status(401).json("Access denied. No token provided");

	try {
		verifyToken(token);
		return next();
	} catch (err) {
		return res.status(400).json("Invalid token");
	}
};

export const requireAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = getToken(req);
	if (!token) return res.status(401).json("Access denied. No token provided");

	try {
		const decoded = verifyToken(token);
		const isAdmin = Object.keys(decoded).includes("isAdmin");
		if (!isAdmin) return res.status(403).json("Access denied.");
		return next();
	} catch (err) {
		return res.status(400).json("Invalid token");
	}
};

const storage = multer.memoryStorage();

export const handleFormatImage = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
			return cb(null, false);
		}
		cb(null, true);
	},
});

const dUri = new DataURIParser();

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 * @see {@link https://medium.com/@joeokpus/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54}
 */

export const dataUri = (req: Request) =>
	dUri.format(
		path.extname(req.file?.originalname!).toString(),
		req.file?.buffer!
	);

export const cloudinaryConfig = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	cloudinary.v2.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		secure: true,
	});
	next();
};
