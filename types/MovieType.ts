import { GenreType } from "./GenreType";

export type MovieType = {
	title: string;
	overview: string;
	genres: GenreType[];
	genreId?: string;
	numberInStock: number;
	dailyRentalRate: number;
	voteAverage: number;
	category: "trending" | "popular";
};
