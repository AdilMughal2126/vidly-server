/* eslint-disable no-mixed-spaces-and-tabs */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { getToken, verifyToken } from "../helpers/auth";
import { numberOfDays } from "../helpers/numberOfDays";
import { JwtPayloadInt } from "../interfaces/JwtPayloadInt";
import { ParamsInt } from "../interfaces/ParamsInt";
import { RentalReqInt } from "../interfaces/RentalInt";
import { asyncMiddleware } from "../middleware/async";
import { Movie } from "../models/movie";
import { Payment } from "../models/payment";
import { Rental } from "../models/rental";
import { User } from "../models/user";

export const handleGetRentals = asyncMiddleware(
	async (req: Request, res: Response) => {
		const token = getToken(req);
		const payload = verifyToken(token as string) as JwtPayloadInt;
		const userRental = await Rental.findOne({ "user._id": payload._id });
		// const filterRentals = userRental?.rentals.filter(
		// 	(r) => r.returnedDate > new Date()
		// );
		return res.json(userRental);
	}
);

export const handleCreateRental = async (
	req: Request<ParamsInt, unknown, RentalReqInt>,
	res: Response,
	next: NextFunction
) => {
	const { movieId, userId, returnedDate, paymentIntentId } = req.body;
	const movie = await Movie.findById(movieId);
	if (!movie) return res.status(400).json("No movie was found");
	if (movie.numberInStock === 0)
		return res.status(404).json("The stock for this movie is empty");
	const user = await User.findById(userId);
	if (!user) return res.status(400).json("User not found");
	const payment = await Payment.findOne({ paymentId: paymentIntentId });
	if (!payment) return res.status(400).json("No payment was found");
	// if (payment?.status !== "succeeded")
	// return res.status(400).json("The payment is not succeeded yet");

	const days = numberOfDays(new Date(returnedDate), new Date());
	const rentalFee = days * movie.dailyRentalRate;

	const rental = {
		movieId,
		rentDate: new Date(),
		returnedDate,
		rentalFee,
		status: payment?.status,
	};
	const userInRental = await Rental.findOne({ "user._id": userId });

	try {
		const session = await mongoose.startSession();
		await session.withTransaction(async () => {
			if (userInRental) {
				userInRental.rentals.push(rental);
				await userInRental.save();
			} else {
				await Rental.create({
					user: {
						_id: user._id,
						name: user.name,
					},
					rentals: [rental],
				});
			}

			movie.numberInStock--;
			await movie.save();
			return res.json("Movie successfully rented");
		});
		return void session.endSession();
	} catch (err) {
		return next(err);
	}
};
