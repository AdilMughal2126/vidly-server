import { Request, Response } from "express";
import { getToken, verifyToken } from "../helpers/auth";
import { BookmarkReqInt } from "../interfaces/BookmarkInt";
import { JwtPayloadInt } from "../interfaces/JwtPayloadInt";
import { ParamsInt } from "../interfaces/ParamsInt";
import { asyncMiddleware } from "../middleware/async";
import { Bookmark } from "../models/bookmark";
import { Movie } from "../models/movie";
import { User } from "../models/user";

export const handleGetBookmarks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const token = getToken(req);
		const user = verifyToken(token as string) as JwtPayloadInt;
		const bookmarks = await Bookmark.findOne({
			"user._id": user._id,
		});
		return res.json(bookmarks);
	}
);

export const handlePostBookmark = asyncMiddleware(
	async (req: Request<unknown, unknown, BookmarkReqInt>, res: Response) => {
		const { userId, movieId } = req.body;

		const user = await User.findById(userId);
		if (!user) return res.status(400).json("User not found");
		const movie = await Movie.findById(movieId);
		if (!movie) return res.status(400).json("Movie not found");

		const userInBookmark = await Bookmark.findOne({ "user._id": userId });

		if (userInBookmark) {
			userInBookmark.bookmarks.push({ movieId });
			await userInBookmark.save();
		} else {
			await Bookmark.create({
				user: {
					_id: user?._id,
					name: user?.name,
				},
				bookmarks: [{ movieId }],
			});
		}

		return res.json("Movie added to bookmarks");
	}
);

export const handleDeleteBookmark = asyncMiddleware(
	async (req: Request<ParamsInt>, res: Response) => {
		const token = getToken(req);
		const user = verifyToken(token as string) as JwtPayloadInt;
		const { movieId } = req.params;

		await Bookmark.findOneAndUpdate(
			{
				"user._id": user._id,
			},
			{ $pull: { bookmarks: { movieId: movieId } } }
		);

		return res.json("Movie removed from bookmarks");
	}
);

export const handleDeleteBookmarks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const { userId } = req.params;
		await Bookmark.deleteOne({ "user._id": userId });
		return res.json("Movies removed from bookmarks");
	}
);
