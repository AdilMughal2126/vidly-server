import { model, Schema } from "mongoose";
import Joi from "joi";
import { UserType } from "../routes/types";

const userSchema = new Schema<UserType>({
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
  hash: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
  },
  isAdmin: Boolean,
});

export const User = model<UserType>("User", userSchema);

export const validateUser = (user: UserType) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(5).max(50).required(),
    password: Joi.string().min(8).max(50).required(),
    email: Joi.string().email().min(8).max(50).required(),
  });

  return schema.validate(user);
};
