import { model, Schema } from "mongoose";
import Joi from "joi";
import { GenreType } from "../routes/types";

export const genreSchema = new Schema<GenreType>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
});

export const Genre = model("Genre", genreSchema);

export const validateGenre = (genre: GenreType) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(5).max(50).required(),
  });

  return schema.validate(genre);
};
