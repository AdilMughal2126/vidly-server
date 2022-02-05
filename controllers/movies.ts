import { Movie } from "../models/movie";
// import { Genre } from "../models/genre";
import { Request, Response } from "express";
// import { Params } from "../types/ParamsType";
// import { MovieType } from "../types/MovieType";
import { asyncMiddleware } from "../middleware/async";

export const handleGetMovies = asyncMiddleware(
	async (req: Request, res: Response) => {
		const movies = await Movie.find().sort("title");
		return res.json(movies);
	}
);

export const handleGetMovie = asyncMiddleware(
	async (req: Request, res: Response) => {
		const movie = await Movie.findById(req.params.id);
		if (!movie) return res.status(404).json("Movie Not Found");
		return res.json(movie);
	}
);

// export const handleCreateMovie = asyncMiddleware(
// 	async (req: Request<unknown, unknown, MovieType>, res: Response) => {
// 		const { title, genreId, numberInStock, dailyRentalRate } = req.body;
// 		const genre = await Genre.findById(genreId);
// 		if (!genre) return res.status(404).json("Genre Not Found");
// 		const movie = await Movie.create({
// 			title,
// 			genres: [{ _id: genre._id, name: genre.name }],
// 			numberInStock,
// 			dailyRentalRate,
// 		});
// 		return res.json(movie);
// 	}
// );

// export const handleUpdateMovie = asyncMiddleware(
// 	async (req: Request<Params, unknown, MovieType>, res: Response) => {
// 		const { title, genreId, numberInStock, dailyRentalRate } = req.body;
// 		const genre = await Genre.findById(genreId);
// 		if (!genre) return res.status(400).json("Invalid Genre");
// 		const movie = await Movie.findByIdAndUpdate(
// 			req.params.id,
// 			{
// 				title,
// 				genre: [{ _id: genre._id, name: genre.name }],
// 				numberInStock,
// 				dailyRentalRate,
// 			},
// 			{ new: true }
// 		);
// 		if (!movie) return res.status(404).json("Movie Not Found");
// 		return res.json(movie);
// 	}
// );

export const handleDeleteMovie = asyncMiddleware(
	async (req: Request, res: Response) => {
		const movie = await Movie.findByIdAndRemove(req.params.id);
		if (!movie) return res.status(404).json("Movie Not Found");
		return res.json(movie);
	}
);
