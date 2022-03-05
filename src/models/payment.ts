import { model, Schema } from "mongoose";
import { PaymentType } from "../types/PaymentType";

export const Payment = model<PaymentType>(
	"Payment",
	new Schema<PaymentType>({
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
