import { connect } from "mongoose";
import { logger } from "../helpers/logger";

export const connectDB = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const connection = await connect(process.env.MONGO_URI_LOCAL!);
    // const connection = await connect(process.env.MONGO_URI_TEST!);
    const { host, port, name } = connection.connection;
    logger.info(`MongoDB Connected: ${host}:${port}/${name}`);
  } catch (err) {
    // logger.info(err);
    logger.error(err);
  }
};
