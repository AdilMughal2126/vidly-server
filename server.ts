/* eslint-disable @typescript-eslint/no-unsafe-call */
import dotenv from "dotenv";
import helmet from "helmet";
import express from "express";
import compression from "compression";
import cors, { CorsOptions } from "cors";

import { connectDB } from "./db/db";
import { auth } from "./routes/auth";
import { users } from "./routes/users";
import { movies } from "./routes/movies";
import { genres } from "./routes/genres";
import { logger } from "./helpers/logger";
import { rentals } from "./routes/rentals";
import { returns } from "./routes/returns";
import { customers } from "./routes/customers";
import { errorHandler } from "./middleware/error";

export const app = express();

dotenv.config();
void connectDB();

const allowList = [process.env.DEV_ENDPOINT];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const isAllowList = allowList.indexOf(origin) !== -1;
    if (isAllowList) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Content-Length", "sentry-trace"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/returns", returns);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, () =>
    logger.info(
      `Server is listening in ${process.env.NODE_ENV as string} mode on port ${
        process.env.PORT as string
      }`
    )
  );
}
