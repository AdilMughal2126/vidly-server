/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from "jsonwebtoken";
import { UserType } from "../routes/types";

export const generateAuthToken = (user: UserType) => {
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_PRIVATE_KEY!
  );
  return token;
};
