/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import _ from "lodash";
import bcrypt from "bcryptjs";
import { User, validateUser } from "../models/user";
import { UserType, Params } from "./types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort("name");
    return res.json(users);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User Not Found");

    return res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post(
  "/",
  async (req: Request<unknown, unknown, UserType>, res: Response) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { name, email } = req.body;

    const isEmail = await User.findOne({ email });
    if (isEmail) return res.status(400).json("Email already registered");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    try {
      const user = await User.create({ name, email, hash });

      return res.json(_.pick(user, ["id", "name", "email"]));
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  async (req: Request<Params, unknown, UserType>, res: Response) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { name, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          hash,
        },
        { new: true }
      );
      if (!user) return res.status(404).json("User Not Found");

      return res.json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).json("User Not Found");

    return res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
});

export { router as users };
