/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../routes/types";

export const generateAuthToken = (user: UserType) => {
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_PRIVATE_KEY!
  );
  return token;
};

export const getToken = (req: Request) => req.header("X-Auth-Token");

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_PRIVATE_KEY!);
