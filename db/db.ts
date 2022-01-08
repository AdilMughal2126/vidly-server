import mongoose from "mongoose";
import { logger } from "../helpers/logger";

export const connectDB = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const connect = await mongoose.connect(process.env.MONGO_URI_TEST!);
    // const connect = await mongoose.connect(process.env.MONGO_URI!);
    const { host, port, name } = connect.connection;
    logger.info(`MongoDB Connected: ${host}:${port}/${name}`);
  } catch (err) {
    // logger.info(err);
    logger.error(err);
  }
};
