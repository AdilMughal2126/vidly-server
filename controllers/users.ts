import _ from "lodash";
import { User } from "../models/user";
import { Request, Response } from "express";
import { UserType } from "../types/UserType";
import { Params } from "../types/ParamsType";
import { asyncMiddleware } from "../middleware/async";
import { generateAuthToken, generateHash } from "../helpers/auth";

export const handleGetUsers = asyncMiddleware(
  async (req: Request, res: Response) => {
    const users = await User.find().sort("name").select("-hash");
    return res.json(users);
  }
);

export const handleGetUser = asyncMiddleware(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select("-hash");
    if (!user) return res.status(404).json("User Not Found");
    return res.json(user);
  }
);

// TODO: Get rid of lodash method
export const handleCreateUser = asyncMiddleware(
  async (req: Request<unknown, unknown, UserType>, res: Response) => {
    const { name, email } = req.body;
    const isEmail = await User.findOne({ email });
    if (isEmail) return res.status(400).json("Email already registered");
    const hash = await generateHash(req.body.password);
    const user = await User.create({ name, email, hash });
    const token = generateAuthToken(user);
    return res
      .header("X-Auth-Token", token)
      .header("Access-Control-Expose-Headers", "X-Auth-Token")
      .json(_.pick(user, ["_id", "name", "email"]));
  }
);

// TODO: Handle Password Update
export const handleUpdateUser = asyncMiddleware(
  async (req: Request<Params, unknown, UserType>, res: Response) => {
    const { name, email } = req.body;
    const hash = await generateHash(req.body.password);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, hash },
      { new: true }
    );
    if (!user) return res.status(404).json("User Not Found");
    return res.json(user);
  }
);

export const handleDeleteUser = asyncMiddleware(
  async (req: Request, res: Response) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).json("User Not Found");
    return res.json(user);
  }
);
