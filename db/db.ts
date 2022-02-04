import mongoose from "mongoose";
import { logger } from "../helpers/logger";

export const connectDB = async () => {
	try {
		const connect = await mongoose.connect(
			"mongodb://localhost/vidly-newSchema"
		);
		const { host, port, name } = connect.connection;
		logger.info(`MongoDB Connected: ${host}:${port}/${name}`);
	} catch (err) {
		logger.error(err);
	}
	// try {
	//   let connect: typeof mongoose;

	//   if (process.env.NODE_ENV === "test") {
	//     connect = await mongoose.connect(process.env.MONGO_URI_TEST as string);
	//     const { host, port, name } = connect.connection;
	//     logger.info(`MongoDB Connected: ${host}:${port}/${name}`);
	//   } else {
	//     connect = await mongoose.connect(process.env.MONGO_URI as string);
	//     const { host, port, name } = connect.connection;
	//     logger.info(`MongoDB Connected: ${host}:${port}/${name}`);
	//   }
	// } catch (err) {
	//   logger.error(err);
	// }
};
