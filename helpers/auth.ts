import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { UserType } from "../types/UserType";

/**
 * ! load dotenv for test case
 */
// dotenv.config();
// import dotenv from "dotenv";

export const generateAuthToken = (user: UserType) => {
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_PRIVATE_KEY as string
  );
  return token;
};

export const getToken = (req: Request) => req.header("X-Auth-Token");

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_PRIVATE_KEY as string);

export const generateHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validateHash = async (password: string, hash: string) =>
  await bcrypt.compare(password, hash);
