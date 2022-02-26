import cloudinary from "cloudinary";
import express, { Request, Response } from "express";
import { dataUri } from "../helpers/auth";
import { asyncMiddleware } from "../middleware/async";
import {
	cloudinaryConfig,
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
		const image = await cloudinary.v2.uploader.upload(file!, {
			folder: "vidly/profile",
		});
		const id = req.header("X-User-Id");
		const user = await User.findByIdAndUpdate(
			id,
			{
				$set: { imageUrl: image.secure_url, imageId: image.public_id },
			},
			{ new: true }
		);

		return res.json(user?.imageUrl);
	})
);

export { router as image };
