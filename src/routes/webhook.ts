/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-case-declarations */
import express, { Request, Response } from "express";
import { Stripe } from "stripe";
import { Payment } from "../models/payment";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
	apiVersion: "2020-08-27",
	typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post(
	"/",
	express.raw({ type: "application/json" }),
	async (
		req: Request<unknown, unknown, "String" | "Buffer">,
		res: Response
	) => {
		const signature = req.headers["stripe-signature"]!;
		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				webhookSecret
			);
		} catch (err: any) {
			console.log("❌ Error message:", err.message);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			return res.status(400).json({ Webhook: err.message });
		}

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

		return res.json("Webhook received");
	}
);

export { router as webhook };
