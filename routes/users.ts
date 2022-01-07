/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import _ from "lodash";
import bcrypt from "bcryptjs";
import { User, validateUser } from "../models/user";
import { UserType, Params } from "./types";
import { generateAuthToken } from "../helpers/auth";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { asyncMiddleware } from "../middleware/async";

const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req: Request, res: Response) => {
    const users = await User.find().sort("name");
    return res.json(users);
  })
);

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-hash");
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

      const token = generateAuthToken(user);

      return res
        .header("X-Auth-Token", token)
        .json(_.pick(user, ["_id", "name", "email"]));
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  requireAuth,
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

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).json("User Not Found");

    return res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
});

export { router as users };
