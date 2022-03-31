import Stripe from "stripe";

export interface PaymentReqInt {
	userId: string;
	movieId: string;
	returnedDate: string;
}

export type PaymentIntentConfirmation =
	| { paymentIntent: Stripe.PaymentIntent; error?: undefined }
	| { paymentIntent?: undefined; error: Stripe.StripeError };

export interface PaymentInt {
	paymentId: string;
	userId: string;
	movieId: string;
	amount: number;
	client_secret: string;
	createAt: number;
	status: string;
}
