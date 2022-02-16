import mongoose from "mongoose";

export type UserType = {
  _id?: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  hash?: string;
  isAdmin?: boolean;
};
