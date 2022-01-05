/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { UserType } from "./types";

const router = express.Router();

router.post(
  "/",
  async (req: Request<unknown, unknown, UserType>, res: Response) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json("Invalid email or password");

      const isValid = await bcrypt.compare(password, user.hash!);
      if (!isValid) return res.status(400).json("Invalid email or password");

      const token = jwt.sign(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { _id: user._id, name: user.name },
        process.env.JWT_PRIVATE_KEY!
      );

      return res.json(token);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

const validate = (user: UserType) => {
  const schema = Joi.object({
    email: Joi.string().email().min(8).max(50).required(),
    password: Joi.string().min(8).max(50).required(),
  });

  return schema.validate(user);
};

export { router as auth };
