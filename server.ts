import express, { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import helmet from "helmet";
import Debug from "debug";
import dotenv from "dotenv";
import { genres } from "./routes/genres";

const app = express();

dotenv.config();

const debugDB = Debug("Express:Database:Connection");
const debugConsole = Debug("Express:Server:Running");

export const connectDB = async () => {
  try {
    const connect: Mongoose = await mongoose.connect(process.env.MONGO_URI!);
    const { host, port, name } = connect.connection;
    debugDB(`MongoDB Connected: ${host}:${port}/${name}`);
  } catch (err) {
    debugDB(`Error: ${err}`);
    process.exit(1);
  }
};

connectDB();

app.use(helmet());
app.use(express.json());
app.use("/api/genres", genres);

app.get("/", (req: Request, res: Response) => res.send("Hello World"));

app.listen(process.env.PORT, () =>
  debugConsole(
    `Server is listenning in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  )
);
