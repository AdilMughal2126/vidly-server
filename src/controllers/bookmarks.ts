import { Request, Response } from "express";
import { getToken, verifyToken } from "../helpers/auth";
import { asyncMiddleware } from "../middleware/async";
import { Bookmark } from "../models/bookmark";
import { Movie } from "../models/movie";
import { User } from "../models/user";
import { BookmarkRequestType } from "../types/BookmarkType";
import { JwtPayload } from "../types/JwtPayload";
import { Params } from "../types/ParamsType";

export const handleGetBookmarks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const token = getToken(req);
		const user = verifyToken(token as string) as JwtPayload;
		const bookmarks = await Bookmark.find({
			"user._id": user._id,
		});
		return res.json(bookmarks);
	}
);

export const handlePostBookmark = asyncMiddleware(
	async (
		req: Request<unknown, unknown, BookmarkRequestType>,
		res: Response
	) => {
		const { userId, movieId } = req.body;

		const user = await User.findById(userId);
		const movie = await Movie.findByIdAndUpdate(
			movieId,
			{ $set: { bookmarks: { _id: userId } } },
			{ new: true }
		);

		await Bookmark.create({
			user: {
				_id: user?._id,
				name: user?.name,
			},
			movie: {
				_id: movie?._id,
				title: movie?.title,
				url: movie?.url,
				voteAverage: movie?.voteAverage,
				bookmarks: movie?.bookmarks,
			},
		});

		return res.json("Movie added to bookmarks");
	}
);

export const handleDeleteBookmark = asyncMiddleware(
	async (req: Request<Params>, res: Response) => {
		const token = getToken(req);
		const user = verifyToken(token as string) as JwtPayload;
		const { movieId } = req.params;
		await Movie.findByIdAndUpdate(movieId, {
			$unset: { bookmarks: { _id: user._id } },
		});
		const bookmark = await Bookmark.findOneAndDelete({
			"user._id": user._id,
			"movie._id": movieId,
		});
		if (!bookmark) return res.status(400).json("Movie not found");
		return res.json("Movie removed from bookmarks");
	}
);

export const handleDeleteBookmarks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const token = getToken(req);
		const user = verifyToken(token as string) as JwtPayload;
		await Movie.findOneAndUpdate(
			{ bookmarks: { _id: user._id } },
			{
				$unset: { bookmarks: { _id: user._id } },
			}
		);
		const bookmarks = await Bookmark.deleteMany({ "user._id": user._id });
		if (!bookmarks) return res.status(400).json("No movies was found");
		return res.json("Movies removed from bookmarks");
	}
);
