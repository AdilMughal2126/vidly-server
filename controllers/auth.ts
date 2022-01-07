/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import Joi from "joi";
//* Model
import { User } from "../models/user";
//* Helper
import { generateAuthToken, validateHash } from "../helpers/auth";
//* Middleware
import { asyncMiddleware } from "../middleware/async";
//* Interfaces
import { Request, Response } from "express";
//* Types
import { UserType } from "../types/UserType";

export const handleAuth = asyncMiddleware(
  async (req: Request<unknown, unknown, UserType>, res: Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid email or password");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const isValid = await validateHash(password, user.hash!);
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
