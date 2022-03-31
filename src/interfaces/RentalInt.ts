export interface RentalInt {
	user: {
		_id: string;
		name: string;
	};
	rentals: {
		movieId: string;
		rentDate: Date;
		returnedDate: Date;
		rentalFee: number;
		status: string;
	}[];
}
// export interface RentalInt {
// 	userId: string;
// 	movie: Pick<MovieInt, "_id" | "title" | "url" | "voteAverage">;
// 	rentDate: Date | { type: DateConstructor; default: () => number };
// 	returnedDate: Date;
// 	rentalFee: number;
// 	status: string;
// }

export interface RentalReqInt {
	returnedDate: Date;
	movieId: string;
	userId: string;
	paymentIntentId: string | undefined;
}
