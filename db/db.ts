import mongoose from "mongoose";
import { logger } from "../helpers/logger";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGO_URI_TEST as string
    );
    // const connect = await connect(process.env.MONGO_URI_LOCAL as string);
    const { host, port, name } = connect.connection;
    logger.info(`MongoDB Connected: ${host}:${port}/${name}`);
  } catch (err) {
    logger.error(err);
  }
};
