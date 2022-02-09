import { GenreType } from "./GenreType";

export type MovieType = {
	genres: GenreType[];
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
