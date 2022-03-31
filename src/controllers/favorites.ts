import { Request, Response } from "express";
import { getToken, verifyToken } from "../helpers/auth";
import { FavoriteReqInt } from "../interfaces/FavoriteInt";
import { JwtPayloadInt } from "../interfaces/JwtPayloadInt";
import { ParamsInt } from "../interfaces/ParamsInt";
import { asyncMiddleware } from "../middleware/async";
import { Favorite } from "../models/favorite";
import { Movie } from "../models/movie";
import { User } from "../models/user";

export const handleGetFavorites = asyncMiddleware(
	async (req: Request, res: Response) => {
		const token = getToken(req);
		const decoded = verifyToken(token as string) as JwtPayloadInt;
		const favorites = await Favorite.findOne({
			"user._id": decoded._id,
		});
		return res.json(favorites);
	}
);

export const handlePostFavorite = asyncMiddleware(
	async (req: Request<unknown, unknown, FavoriteReqInt>, res: Response) => {
		const { userId, movieId } = req.body;
		const user = await User.findById(userId);
		if (!user) return res.status(400).json("User not found");
		const movie = await Movie.findById(movieId);
		if (!movie) return res.status(400).json("Movie not found");

		const userInFav = await Favorite.findOne({ "user._id": userId });

		if (userInFav) {
			userInFav.favorites.push({ movieId });
			await userInFav.save();
		} else {
			await Favorite.create({
				user: {
					_id: user?._id,
					name: user?.name,
				},
				favorites: [{ movieId }],
			});
		}

		return res.json("Movie added to favorites");
	}
);

export const handleDeleteFavorite = asyncMiddleware(
	async (req: Request<ParamsInt>, res: Response) => {
		const token = getToken(req);
		const user = verifyToken(token as string) as JwtPayloadInt;
		const { movieId } = req.params;

		await Favorite.findOneAndUpdate(
			{
				"user._id": user._id,
			},
			{
				$pull: { favorites: { movieId: movieId } },
			}
		);

		return res.json("Movie removed from favorites");
	}
);

export const handleDeleteFavorites = asyncMiddleware(
	async (req: Request, res: Response) => {
		const { userId } = req.params;
		await Favorite.deleteOne({ "user._id": userId });
		return res.json("Movies removed from favorites");
	}
);
