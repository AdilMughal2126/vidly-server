import Joi from "joi";
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
	const schema = Joi.object({
		returnedDate: Joi.string().isoDate().required(),
		movieId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
			.required(),
		userId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
			.required(),
		paymentIntentId: Joi.string().required(),
	});

	return schema.validate(rental);
};
