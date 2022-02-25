import cloudinary from "cloudinary";
import express, { Request, Response } from "express";
import { asyncMiddleware } from "../middleware/async";
import {
	cloudinaryConfig,
	dataUri,
	handleFormatImage,
	requireAuth,
} from "../middleware/auth";
import { User } from "../models/user";

const router = express.Router();

router.post(
	"/",
	[requireAuth, handleFormatImage.single("image"), cloudinaryConfig],
	asyncMiddleware(async (req: Request, res: Response) => {
		const file = dataUri(req).content;
		const image = await cloudinary.v2.uploader.upload(file!);
		const id = req.header("X-User-Id");
		const user = await User.findByIdAndUpdate(id, {
			$set: { imageUrl: image.secure_url, imageId: image.public_id },
		});

		return res.json(user?.imageId);
	})
);

export { router as image };
