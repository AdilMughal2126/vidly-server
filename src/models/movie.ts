import { number, object, string } from "joi";
import { model, Schema } from "mongoose";
import { MovieType } from "../types/MovieType";
import { genreSchema } from "./genre";

export const Movie = model(
	"Movie",
	new Schema<MovieType>({
		genre: {
			type: genreSchema,
			required: true,
		},
		title: {
			type: String,
			trim: true,
			required: true,
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
		likes: {
			type: [{ _id: String }],
		},
		bookmarks: {
			type: [{ _id: String }],
		},
		rentals: {
			type: [{ _id: String }],
		},
	})
);

export const validateMovie = (movie: MovieType) => {
	const schema = object({
		title: string().trim().min(5).max(50).required(),
		genreId: string()
			.regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
			.required(),
		numberInStock: number().min(0).max(100).required(),
		dailyRentalRate: number().min(0).max(10).required(),
	});

	return schema.validate(movie);
};
