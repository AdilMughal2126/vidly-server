import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
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

const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
			cb(new Error("Only image files are allowed"), false);
		}
		return cb(null, true);
	},
}).single("image");

export const handleValidateImage = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	upload(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(400).json(err);
		} else if (err) {
			return res.status(400).json(err);
		}

		return next();
	});
};

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
	// console.log(req.file);
	if (!req.file) return res.status(400).json("Bad request");
	return next();
};
