/* eslint-disable @typescript-eslint/no-non-null-assertion */
import cloudinary from "cloudinary";
import express, { Request, Response } from "express";
import { dataUri, getToken, verifyToken } from "../helpers/auth";
import { JwtPayloadInt } from "../interfaces/JwtPayloadInt";
import { asyncMiddleware } from "../middleware/async";
import {
	cloudinaryConfig,
	handleValidateImage,
	requireAuth,
} from "../middleware/auth";
import { User } from "../models/user";

const router = express.Router();

router.post(
	"/",
	[requireAuth, handleValidateImage, cloudinaryConfig],
	asyncMiddleware(async (req: Request, res: Response) => {
		const token = getToken(req);
		const decoded = verifyToken(token as string) as JwtPayloadInt;
		if (!req.file) return res.status(400).json("Only image files are allowed!");
		const file = dataUri(req).content;
		const userInDb = await User.findById(decoded._id);
		if (!userInDb) return res.status(400).json("User not found");

		await cloudinary.v2.uploader.destroy(userInDb.imageId!);
		const image = await cloudinary.v2.uploader.upload(file!, {
			folder: "vidly/profile",
		});
		const updatedUser = await User.findByIdAndUpdate(
			decoded._id,
			{
				$set: { imageUrl: image.secure_url, imageId: image.public_id },
			},
			{ new: true }
		);

		return res.json(updatedUser?.imageUrl);
	})
);

export { router as profile };
