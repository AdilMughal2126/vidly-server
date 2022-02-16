import Joi from "joi";
import { model, Schema } from "mongoose";
import { CustomerType } from "../types/CustomerType";

export const Customer = model(
  "Customer",
  new Schema<CustomerType>({
    name: {
      type: String,
      required: true,
      trim: true,
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
  })
);

export const validateCustomer = (customer: CustomerType) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(5).max(50).required(),
    phone: Joi.string().min(8).max(50).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};
