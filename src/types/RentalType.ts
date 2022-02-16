import { MovieType } from "./MovieType";
import { UserType } from "./UserType";

export type RentalType = {
	user: Pick<UserType, "_id" | "name" | "email" | "isAdmin">;
	movie: Pick<MovieType, "title" | "dailyRentalRate">;
	dateOut: Date | { type: DateConstructor; default: () => number };
	dateReturned: Date;
	rentalFee: number;
};
