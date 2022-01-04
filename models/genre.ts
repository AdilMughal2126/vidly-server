import { model, Schema } from "mongoose";
import Joi from "joi";
import { GenreType } from "../routes/types";

export const Genre = model(
  "Genre",
  new Schema<GenreType>({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
  })
);

export const validateGenre = (genre: GenreType) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
};
