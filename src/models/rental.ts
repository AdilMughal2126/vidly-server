import { date, object, string } from "joi";
import { model, Schema } from "mongoose";
import { RentalRequestType, RentalType } from "../types/RentalType";

const rentalSchema = new Schema<RentalType>({
	userId: {
		type: String,
		required: true,
	},
	movie: {
		type: new Schema({
			title: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
			voteAverage: {
				type: String,
				required: true,
			},
			rentals: {
				type: [{ _id: String }],
			},
		}),
		required: true,
	},
	rentDate: {
		type: Date,
	},
	returnedDate: {
		type: Date,
	},
	rentalFee: {
		type: Number,
		min: 0,
	},
	status: {
		type: String,
		required: true,
	},
});

export const Rental = model("Rental", rentalSchema);

export const validateRental = (rental: RentalRequestType) => {
	const schema = object({
		returnedDate: date().required(),
		movieId: string()
			.regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
			.required(),
		userId: string()
			.regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
			.required(),
		paymentIntentId: string().required(),
	});

	return schema.validate(rental);
};
