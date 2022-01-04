import { model, Schema } from "mongoose";
import Joi from "joi";
import { CustomerRental, RentalType } from "../routes/types";

export const Rental = model(
  "Rental",
  new Schema<RentalType>({
    customer: {
      type: new Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255,
        },
        phone: {
          type: String,
          required: true,
          minlength: 8,
          maxlength: 255,
        },
        isGold: {
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
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

export const validateRental = (rental: CustomerRental) => {
  const schema = Joi.object({
    customerId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
      .required(),
    movieId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
      .required(),
  });

  return schema.validate(rental);
};
