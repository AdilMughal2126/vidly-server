import { model, Schema } from "mongoose";
import { PaymentInt } from "../interfaces/PaymentInt";

export const Payment = model<PaymentInt>(
	"Payment",
	new Schema<PaymentInt>({
		paymentId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		movieId: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		client_secret: {
			type: String,
			required: true,
		},
		createAt: {
			type: Number,
			required: true,
		},
	})
);
