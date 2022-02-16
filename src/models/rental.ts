import Joi from "joi";
import mongoose, { model, Schema } from "mongoose";
import { CustomerRental } from "../types/CustomerRentalType";
import { RentalType } from "../types/RentalType";

const rentalSchema = new Schema<RentalType>({
	user: {
		type: new Schema({
			_id: mongoose.Types.ObjectId,
			name: {
				type: String,
				required: true,
				trim: true,
				minlength: 5,
				maxlength: 255,
			},
			email: {
				type: String,
				required: true,
				unique: true,
				minlength: 8,
				maxlength: 255,
			},
			isAdmin: {
				type: Boolean,
				default: false,
			},
		}),
		required: true,
	},
	movie: {
		type: new Schema({
			title: {
				type: String,
				required: true,
				trim: true,
				minlength: 5,
				maxlength: 255,
			},
			dailyRentalRate: {
				type: Number,
				required: true,
				min: 0,
				max: 255,
			},
		}),
		required: true,
	},
	dateOut: {
		type: Date,
	},
	dateReturned: {
		type: Date,
	},
	rentalFee: {
		type: Number,
		min: 0,
	},
});

export const Rental = model("Rental", rentalSchema);

export const validateRental = (rental: CustomerRental) => {
	const schema = Joi.object({
		dateOut: Joi.string().isoDate().required(),
		dateReturned: Joi.string().isoDate().required(),
		movieId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
			.required(),
	});

	return schema.validate(rental);
};
