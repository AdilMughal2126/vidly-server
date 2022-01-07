import { Request, Response } from "express";
import { asyncMiddleware } from "../middleware/async";
import { Genre } from "../models/genre";
import { Movie, validateMovie } from "../models/movie";
import { MovieType } from "../types/MovieType";
import { Params } from "../types/ParamsType";

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

export const handleCreateMovie = asyncMiddleware(
  async (req: Request<unknown, unknown, MovieType>, res: Response) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    const { title, genreId, numberInStock, dailyRentalRate } = req.body;
    const genre = await Genre.findById(genreId);
    if (!genre) return res.status(400).json("Invalid Genre");
    const movie = await Movie.create({
      title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      genre: { _id: genre._id, name: genre.name },
      numberInStock,
      dailyRentalRate,
    });
    return res.json(movie);
  }
);

export const handleUpdateMovie = asyncMiddleware(
  async (req: Request<Params, unknown, MovieType>, res: Response) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    const { title, genreId, numberInStock, dailyRentalRate } = req.body;
    const genre = await Genre.findById(genreId);
    if (!genre) return res.status(400).json("Invalid Genre");
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        genre: { _id: genre._id, name: genre.name },
        numberInStock,
        dailyRentalRate,
      },
      { new: true }
    );
    if (!movie) return res.status(404).json("Movie Not Found");
    return res.json(movie);
  }
);

export const handleDeleteMovie = asyncMiddleware(
  async (req: Request, res: Response) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).json("Movie Not Found");
    return res.json(movie);
  }
);
