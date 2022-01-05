/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { Genre } from "../models/genre";
import { Movie, validateMovie } from "../models/movie";
import { MovieType, Params } from "./types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find().sort("title");
    return res.json(movies);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json("Movie Not Found");

    return res.json(movie);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post(
  "/",
  async (req: Request<unknown, unknown, MovieType>, res: Response) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { title, genreId, numberInStock, dailyRentalRate } = req.body;

    const genre = await Genre.findById(genreId);
    if (!genre) return res.status(400).json("Invalid Genre");

    try {
      const movie = await Movie.create({
        title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        genre: { _id: genre._id, name: genre.name },
        numberInStock,
        dailyRentalRate,
      });

      return res.json(movie);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  async (req: Request<Params, unknown, MovieType>, res: Response) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { title, genreId, numberInStock, dailyRentalRate } = req.body;

    const genre = await Genre.findById(genreId);
    if (!genre) return res.status(400).json("Invalid Genre");

    try {
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
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).json("Movie Not Found");

    return res.json(movie);
  } catch (err) {
    return res.status(400).json(err);
  }
});

export { router as movies };
