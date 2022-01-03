/* eslint-disable @typescript-eslint/no-misused-promises */
// file deepcode ignore Sqli: <please specify a reason of ignoring this>
import express, { Request, Response } from "express";
import { Genre, validateGenre } from "../models/genres";
import { GenreType, Params } from "./types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const genre = await Genre.findById({ _id: req.params.id });
    if (!genre) return res.status(404).json("Genre Not Found");

    return res.json(genre);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post(
  "/",
  async (req: Request<unknown, unknown, GenreType>, res: Response) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    try {
      const genre = await Genre.create({ name: req.body.name });
      return res.json(genre);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  async (req: Request<Params, unknown, GenreType>, res: Response) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    try {
      const genre = await Genre.findById(req.params.id);
      if (!genre) return res.status(404).json("Genre Not Found");

      const updated = await Genre.updateOne({ name: req.body.name });

      return res.json(updated);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json("Genre Not Found");

    const deleted = await Genre.deleteOne({ _id: req.params.id });

    return res.json(deleted);
  } catch (err) {
    return res.status(400).json(err);
  }
});

export { router as genres };
