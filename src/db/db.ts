/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "../helpers/logger";

dotenv.config();

export const connectDB = async () => {
	try {
		let connect: typeof mongoose;

		if (process.env.NODE_ENV === "test") {
			connect = await mongoose.connect(process.env.MONGO_URI_TEST as string);
		} else {
			connect = await mongoose.connect(
				`${process.env.MONGO_URI_1!}${encodeURIComponent(
					process.env.MONGO_URI_2!
				)}${process.env.MONGO_URI_3!}`
			);
		}

		const { host, port, name } = connect.connection;
		logger.info(`MongoDB Connected: ${host}:${port}/${name}`);
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
};
