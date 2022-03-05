/* eslint-disable no-case-declarations */

import express, { Request, Response } from "express";
import { Stripe } from "stripe";
// import { asyncMiddleware } from "../middleware/async";
import { Payment } from "../models/payment";

const router = express.Router();

const stripe = new Stripe(
	"sk_test_51JEwp0G8f5i7HLkxjuGskMgfjB7X3LYIbxaQpyUVe7nM6UZQ8M3YYsr8QNZTWnHw3WafK0FHlGsO10bd34pBt1O600xeWNTG36",
	{ apiVersion: "2020-08-27", typescript: true }
);

router.post(
	"/",
	express.raw({ type: "application/json" }),
	async (
		req: Request<unknown, unknown, "String" | "Buffer">,
		res: Response
	) => {
		const endpointSecret =
			"whsec_feda210cbf81d060ab7d6506b79bc66b3d7ba978dd6d533ff085bfb9e1994d27";

		const signature = req.headers["stripe-signature"]!;

		const event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			endpointSecret
		);

		switch (event.type) {
			case "payment_intent.succeeded":
				const paymentIntent = event.data.object as Stripe.PaymentIntent;
				await Payment.findOneAndUpdate(
					{ paymentId: paymentIntent.id },
					{ $set: { status: paymentIntent?.status } }
				);
				break;
			case "charge.succeeded":
				// const charge = event.data.object as Stripe.PaymentIntent;
				console.log("✅ Charge succeeded");
				break;

			default:
				break;
		}

		res.json("Webhook received");
	}
);

export { router as webhook };
