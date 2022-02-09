import Joi from "joi";
import { model, Schema } from "mongoose";
import { MovieType } from "../types/MovieType";
import { genreSchema } from "./genre";

export const Movie = model(
	"Movie",
	new Schema<MovieType>({
		genres: {
			type: [genreSchema],
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 255,
		},
		overview: {
			type: String,
		},
		category: {
			type: String,
		},
		url: {
			type: String,
		},
		dateRelease: {
			type: String,
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
		voteAverage: {
			type: Number,
			required: true,
			min: 0,
			max: 10,
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
