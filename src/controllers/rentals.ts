/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { getToken, verifyToken } from "../helpers/auth";
import { numberOfDays } from "../helpers/numberOfDays";
import { asyncMiddleware } from "../middleware/async";
import { Movie } from "../models/movie";
import { Rental } from "../models/rental";
import { CustomerRental } from "../types/CustomerRentalType";
import { Params } from "../types/ParamsType";

export const handleGetRentals = asyncMiddleware(
	async (req: Request, res: Response) => {
		const rentals = await Rental.find().sort("-dateOut");

		const filterRentals = rentals.filter(async (rental) => {
			const isExpire = rental.dateReturned === new Date();
			if (!isExpire) return rental;
			await Movie.findOneAndUpdate({ rental }, { $inc: { numberInStock: 1 } });
			return await Rental.findOneAndRemove({ rental });
		});

		return res.json(filterRentals);
	}
);

// export const handleGetRental = asyncMiddleware(
// 	async (req: Request, res: Response) => {
// 		const rental = await Rental.findById(req.params.id);
// 		if (!rental) return res.status(404).json("Rental Not Found");
// 		return res.json(rental);
// 	}
// );

export const handleCreateRental = async (
	req: Request<Params, unknown, CustomerRental>,
	res: Response,
	next: NextFunction
) => {
	const user = verifyToken(getToken(req) as string);
	const { movieId, dateOut, dateReturned } = req.body;
	const movie = await Movie.findById(movieId);
	if (!movie) return res.status(400).json("Invalid Movie");
	if (movie.numberInStock === 0) return res.status(404).json("No Movie Found");

	const days = numberOfDays(+dateReturned, +dateOut);
	const rentalFee = days * movie.dailyRentalRate;

	try {
		const session = await mongoose.startSession();
		await session.withTransaction(async () => {
			const rental = await Rental.create({
				user,
				movie: {
					_id: movie?._id?.toHexString(),
					title: movie.title,
					dailyRentalRate: movie.dailyRentalRate,
				},
				dateOut,
				dateReturned,
				rentalFee,
			});

			movie.numberInStock--;
			await movie.save();
			res.json(rental);
		});
		return void session.endSession();
	} catch (err) {
		return next(err);
	}
};
