import { createLogger, format, transports } from "winston";
// import "winston-mongodb";

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
      filename: "logfile.log",
    }),
    // new transports.MongoDB({
    //   level: "error",
    //   db: "mongodb://localhost/vidly-backend",
    //   storeHost: true,
    //   tryReconnect: true,
    // }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: "exceptions.log",
    }),
  ],
});
