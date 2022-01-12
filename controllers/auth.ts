import Joi from "joi";
import { User } from "../models/user";
import { Request, Response } from "express";
import { UserType } from "../types/UserType";
import { asyncMiddleware } from "../middleware/async";
import { generateAuthToken, validateHash } from "../helpers/auth";

export const handleAuth = asyncMiddleware(
  async (req: Request<unknown, unknown, UserType>, res: Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid email or password");
    const isValid = await validateHash(password, user.hash as string);
    if (!isValid) return res.status(400).json("Invalid email or password");
    const token = generateAuthToken(user);
    return res.json(token);
  }
);

const validate = (user: UserType) => {
  const schema = Joi.object({
    email: Joi.string().email().min(8).max(50).required(),
    password: Joi.string().min(8).max(50).required(),
  });

  return schema.validate(user);
};
