import { Request, Response } from "express";
import { getToken, verifyToken } from "../helpers/auth";
import { asyncMiddleware } from "../middleware/async";
import { Favorite } from "../models/favorite";
import { Movie } from "../models/movie";
import { User } from "../models/user";
import { FavoriteRequestType } from "../types/FavoriteType";
import { JwtPayload } from "../types/JwtPayload";
import { Params } from "../types/ParamsType";

export const handleGetFavorites = asyncMiddleware(
	async (req: Request, res: Response) => {
		const token = getToken(req);
		const decoded = verifyToken(token as string) as JwtPayload;
		const favorites = await Favorite.find({
			"user._id": decoded._id,
		});
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
		if (!user) return res.status(400).json("User not found");
		const movie = await Movie.findByIdAndUpdate(
			movieId,
			{ $set: { likes: { _id: userId } } },
			{ new: true }
		);
		if (!movie) return res.status(400).json("Movie not found");
		await Favorite.create({
			user: {
				_id: user?._id,
				name: user?.name,
			},
			movie: {
				_id: movie?._id,
				title: movie?.title,
				url: movie?.url,
				voteAverage: movie?.voteAverage,
				likes: movie?.likes,
			},
		});

		return res.json("Movie added to favorites");
	}
);

export const handleDeleteFavorite = asyncMiddleware(
	async (req: Request<Params>, res: Response) => {
		const token = getToken(req);
		const user = verifyToken(token as string) as JwtPayload;
		const { movieId } = req.params;
		await Movie.findByIdAndUpdate(movieId, {
			$unset: { likes: { _id: user._id } },
		});
		const fav = await Favorite.findOneAndDelete({
			"user._id": user._id,
			"movie._id": movieId,
		});
		if (!fav) return res.status(400).json("Movie not found");
		return res.json("Movie removed from favorites");
	}
);

export const handleDeleteFavorites = asyncMiddleware(
	async (req: Request, res: Response) => {
		const { userId } = req.params;
		const user = await User.findById(userId);
		if (!user) return res.status(400).json("User not found");

		await Favorite.deleteMany({ "user._id": userId });

		const movies = await Movie.find({ likes: { _id: userId } });
		movies.map(async (m) => {
			await m.update({ $unset: { likes: { _id: userId } } });
		});

		return res.json("Movies removed from favorites");
	}
);
