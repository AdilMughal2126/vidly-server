import { MovieType } from "./MovieType";

export type RentalType = {
	userId: string;
	movie: Pick<MovieType, "_id" | "title" | "url" | "voteAverage" | "rentals">;
	rentDate: Date | { type: DateConstructor; default: () => number };
	returnedDate: Date;
	rentalFee: number;
	status: string;
};

export type RentalRequestType = {
	returnedDate: Date;
	movieId: string;
	userId: string;
	paymentIntentId: string | undefined;
};
