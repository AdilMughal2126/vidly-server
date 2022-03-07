import compression from "compression";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./db/db";
import { logger } from "./helpers/logger";
import { errorHandler } from "./middleware/error";
import { auth } from "./routes/auth";
import { bookmarks } from "./routes/bookmarks";
import { customers } from "./routes/customers";
import { favorites } from "./routes/favorites";
import { feedbacks } from "./routes/feedbacks";
import { genres } from "./routes/genres";
import { image } from "./routes/image";
import { movies } from "./routes/movies";
import { payment } from "./routes/payment";
import { rentals } from "./routes/rentals";
import { users } from "./routes/users";
import { webhook } from "./routes/webhook";

export const app = express();

dotenv.config();
void connectDB();

const allowList = [process.env.CLIENT_ENDPOINT];

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		const isAllowList = allowList.indexOf(origin) !== -1;
		if (isAllowList) {
			callback(null, true);
		} else {
			console.log({ origin });
			callback(new Error("Not allowed by CORS"));
		}
	},
	allowedHeaders: [
		"Content-Type",
		"Content-Length",
		"sentry-trace",
		"X-Auth-Token",
		"X-User-Id",
	],
};

app.use(helmet());
app.use(compression());
app.use("/api/webhook", webhook);
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/image", image);
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/rentals", rentals);
app.use("/api/feedback", feedbacks);
app.use("/api/customers", customers);
app.use("/api/favorites", favorites);
app.use("/api/bookmarks", bookmarks);
app.use("/api/payment", payment);
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
