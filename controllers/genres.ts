import { Request, Response } from "express";
import { asyncMiddleware } from "../middleware/async";
import { Genre } from "../models/genre";
import { GenreType } from "../types/GenreType";
import { Params } from "../types/ParamsType";

export const handleGetGenres = asyncMiddleware(
  async (req: Request, res: Response) => {
    const genres = await Genre.find().sort("name");
    return res.json(genres);
  }
);

export const handleGetGenre = asyncMiddleware(
  async (req: Request, res: Response) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json("Genre Not Found");
    return res.json(genre);
  }
);

export const handleCreateGenre = asyncMiddleware(
  async (req: Request<unknown, unknown, GenreType>, res: Response) => {
    const genre = await Genre.create({ name: req.body.name });
    return res.json(genre);
  }
);

export const handleUpdateGenre = asyncMiddleware(
  async (req: Request<Params, unknown, GenreType>, res: Response) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) return res.status(404).json("Genre Not Found");
    return res.json(genre);
  }
);

export const handleDeleteGenre = asyncMiddleware(
  async (req: Request, res: Response) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).json("Genre Not Found");
    return res.json(genre);
  }
);
