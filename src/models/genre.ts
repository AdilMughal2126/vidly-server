import Joi from "joi";
import { model, Schema } from "mongoose";
import { GenreType } from "../types/GenreType";

export const genreSchema = new Schema<GenreType>({
	name: {
		type: String,
		trim: true,
		required: true,
		minlength: 3,
		maxlength: 255,
	},
});

export const Genre = model("Genre", genreSchema);

export const validateGenre = (genre: GenreType) => {
	const schema = Joi.object({
		name: Joi.string().trim().min(3).max(50).required(),
	});

	return schema.validate(genre);
};
