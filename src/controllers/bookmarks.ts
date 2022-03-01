import { Request, Response } from "express";
import { asyncMiddleware } from "../middleware/async";
import { Bookmark } from "../models/bookmark";
import { Movie } from "../models/movie";
import { User } from "../models/user";
import { BookmarkRequestType } from "../types/BookmarkType";
import { Params } from "../types/ParamsType";

export const handleGetBookmarks = asyncMiddleware(
	async (req: Request, res: Response) => {
		const bookmarks = await Bookmark.find({
			"user._id": req.header("X-User-Id"),
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
			{ $set: { bookmarks: { userId } } },
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
		const { userId, movieId } = req.params;
		await Movie.findByIdAndUpdate(movieId, {
			$unset: { bookmarks: { userId } },
		});
		const bookmark = await Bookmark.findOneAndDelete({
			"user._id": userId,
			"movie._id": movieId,
		});
		if (!bookmark) return res.status(400).json("Movie not found");
		return res.json("Movie removed from bookmarks");
	}
);
