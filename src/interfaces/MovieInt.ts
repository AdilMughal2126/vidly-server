import mongoose from "mongoose";
import { GenreInt } from "./GenreInt";

export interface MovieInt {
	_id?: mongoose.Types.ObjectId | undefined;
	genre: GenreInt;
	title: string;
	overview: string;
	dateRelease: string;
	url: string;
	genreId?: string;
	numberInStock: number;
	dailyRentalRate: number;
	voteAverage: number;
	category: "trending" | "popular";
}
