import mongoose, { Mongoose } from "mongoose";
import Debug from "debug";

const debugDB = Debug("Express:Database:Connection");

export const connectDB = async () => {
  try {
    const connect: Mongoose = await mongoose.connect(process.env.MONGO_URI!);
    const { host, port, name } = connect.connection;
    debugDB(`MongoDB Connected: ${host}:${port}/${name}`);
  } catch (err) {
    debugDB(err);
    process.exit(1);
  }
};
