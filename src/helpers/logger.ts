/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";
import { createLogger, format, transports } from "winston";
import "winston-mongodb";
dotenv.config();

export const logger = createLogger({
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize({ all: true }),
				format.prettyPrint({ colorize: true }),
				format.simple()
			),
		}),
		new transports.File({
			level: "error",
			filename: "logFile.log",
		}),
		new transports.MongoDB({
			level: "error",
			db: `${process.env.MONGO_URI_1!}${encodeURIComponent(
				process.env.MONGO_URI_2!
			)}${process.env.MONGO_URI_3!}`,
			storeHost: true,
			tryReconnect: true,
			collection: "winston_logs",
		}),
	],
	exceptionHandlers: [
		new transports.File({
			filename: "exceptions.log",
		}),
	],
});
