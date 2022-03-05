import Stripe from "stripe";

export type PaymentRequestType = {
	userId: string;
	movieId: string;
	returnedDate: string;
};

export type PaymentIntentConfirmation =
	| { paymentIntent: Stripe.PaymentIntent; error?: undefined }
	| { paymentIntent?: undefined; error: Stripe.StripeError };

export type PaymentType = {
	paymentId: string;
	userId: string;
	movieId: string;
	amount: number;
	client_secret: string;
	createAt: number;
	status: string;
};
