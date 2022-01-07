import Joi from "joi";
import { model, Schema } from "mongoose";
import { genreSchema } from "./genre";
import { MovieType } from "../types/MovieType";

export const Movie = model(
  "Movie",
  new Schema<MovieType>({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

export const validateMovie = (movie: MovieType) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(5).max(50).required(),
    genreId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
      .required(),
    numberInStock: Joi.number().min(0).max(100).required(),
    dailyRentalRate: Joi.number().min(0).max(10).required(),
  });

  return schema.validate(movie);
};
