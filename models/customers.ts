import { model, Schema } from "mongoose";
import Joi from "joi";
import { CustomerType } from "../routes/types";

export const Customer = model(
  "Customer",
  new Schema<CustomerType>({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
  })
);

export const validateCustomer = (customer: CustomerType) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};
