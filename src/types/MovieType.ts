import mongoose from "mongoose";
import { GenreType } from "./GenreType";

export type MovieType = {
	// _id?: string;
	_id?: mongoose.Types.ObjectId | undefined;
	genre: GenreType;
	title: string;
	overview: string;
	dateRelease: string;
	url: string;
	genreId?: string;
	numberInStock: number;
	dailyRentalRate: number;
	voteAverage: number;
	category: "trending" | "popular";
};
