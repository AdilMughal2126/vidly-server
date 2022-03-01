import { Request, Response } from "express";
import { asyncMiddleware } from "../middleware/async";
import { Favorite } from "../models/favorite";
import { Movie } from "../models/movie";
import { User } from "../models/user";
import { FavoriteRequestType } from "../types/FavoriteType";
import { Params } from "../types/ParamsType";

export const handleGetFavorites = asyncMiddleware(
	async (req: Request, res: Response) => {
		const favorites = await Favorite.find({ user: { _id: req.params.id } });
		return res.json(favorites);
	}
);

export const handlePostFavorite = asyncMiddleware(
	async (
		req: Request<unknown, unknown, FavoriteRequestType>,
		res: Response
	) => {
		const { userId, movieId } = req.body;
		const user = await User.findById(userId);
		const movie = await Movie.findByIdAndUpdate(
			movieId,
			{ $set: { likes: { userId } } },
			{ new: true }
		);
		await Favorite.create({
			user: {
				_id: user?._id,
				name: user?.name,
			},
			movie: {
				_id: movie?._id,
				title: movie?.title,
			},
		});

		return res.json("Movie added to favorites");
	}
);

export const handleDeleteFavorite = asyncMiddleware(
	async (req: Request<Params>, res: Response) => {
		const { userId, movieId } = req.params;
		await Movie.findByIdAndUpdate(
			movieId,
			{ $unset: { likes: { userId } } },
			{ new: true }
		);
		const fav = await Favorite.findOneAndDelete({
			"user._id": userId,
			"movie._id": movieId,
		});
		if (!fav) return res.status(400).json("Movie not found");
		return res.json("Movie removed from favorites");
	}
);
