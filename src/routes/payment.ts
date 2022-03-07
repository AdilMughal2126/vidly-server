/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express, { Request, Response } from "express";
import { Stripe } from "stripe";
import { numberOfDays } from "../helpers/numberOfDays";
import { asyncMiddleware } from "../middleware/async";
import { requireAuth } from "../middleware/auth";
import { Movie } from "../models/movie";
import { Payment } from "../models/payment";
import { PaymentRequestType } from "../types/PaymentType";

const router = express.Router();

// const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
// 	apiVersion: "2020-08-27",
// 	typescript: true,
// });

const stripe = new Stripe(
	"sk_test_51JEwp0G8f5i7HLkxjuGskMgfjB7X3LYIbxaQpyUVe7nM6UZQ8M3YYsr8QNZTWnHw3WafK0FHlGsO10bd34pBt1O600xeWNTG36",
	{ apiVersion: "2020-08-27", typescript: true }
);

const handleCreatePayment = asyncMiddleware(
	async (req: Request<unknown, unknown, PaymentRequestType>, res: Response) => {
		const { userId, movieId, returnedDate } = req.body;

		const movie = await Movie.findById(movieId);
		if (!movie) return res.status(400).json("Movie not found");

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
