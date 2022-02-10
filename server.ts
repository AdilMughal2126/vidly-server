import compression from "compression";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./db/db";
import { logger } from "./helpers/logger";
import { errorHandler } from "./middleware/error";
import { auth } from "./routes/auth";
import { customers } from "./routes/customers";
import { genres } from "./routes/genres";
import { movies } from "./routes/movies";
import { rentals } from "./routes/rentals";
import { users } from "./routes/users";

export const app = express();

dotenv.config();
void connectDB();

const allowList = [process.env.DEV_ENDPOINT];

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		const isAllowList = allowList.indexOf(origin) !== -1;
		if (isAllowList) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	allowedHeaders: [
		"Content-Type",
		"Content-Length",
		"sentry-trace",
		"X-Auth-Token",
	],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
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
