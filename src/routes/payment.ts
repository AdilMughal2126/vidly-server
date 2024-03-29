/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Stripe } from "stripe";
import { numberOfDays } from "../helpers/numberOfDays";
import { PaymentReqInt } from "../interfaces/PaymentInt";
import { asyncMiddleware } from "../middleware/async";
import { requireAuth } from "../middleware/auth";
import { Movie } from "../models/movie";
import { Payment } from "../models/payment";
import { User } from "../models/user";

const router = express.Router();
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
	apiVersion: "2020-08-27",
	typescript: true,
});

const handleCreatePayment = asyncMiddleware(
	async (req: Request<unknown, unknown, PaymentReqInt>, res: Response) => {
		const { userId, movieId, returnedDate } = req.body;

		const user = await User.findById(userId);
		if (!user) return res.status(400).json("User not found");
		const movie = await Movie.findById(movieId);
		if (!movie) return res.status(400).json("Movie not found");
		const isRented = await Payment.findOne({ userId, movieId });
		if (isRented) return res.status(400).json("Movie already rented!");

		const days = numberOfDays(new Date(returnedDate), new Date());
		const rentalFee = Math.round(days * movie.dailyRentalRate);

		const paymentIntents = await stripe.paymentIntents.create({
			amount: rentalFee * 100,
			currency: "usd",
		});

		await Payment.create({
			paymentId: paymentIntents.id,
			userId,
			movieId,
			amount: paymentIntents.amount,
			client_secret: paymentIntents.client_secret,
			createAt: paymentIntents.created,
			status: paymentIntents.status,
		});

		return res.json(paymentIntents.client_secret);
	}
);

router.post("/", requireAuth, handleCreatePayment);

export { router as payment };
