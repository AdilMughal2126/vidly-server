/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express from "express";
import helmet from "helmet";
import Debug from "debug";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { genres } from "./routes/genres";
import { customers } from "./routes/customers";

const debugDB = Debug("Express:Database:Connection");
const debugConsole = Debug("Express:Server:Running");

const app = express();

dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI!);
    const { host, port, name } = connect.connection;
    debugDB(`MongoDB Connected: ${host}:${port}/${name}`);
  } catch (err) {
    debugDB(err);
    process.exit(1);
  }
};

void connectDB();

app.use(helmet());
app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);

app.listen(process.env.PORT, () =>
  debugConsole(
    `Server is listenning in ${process.env.NODE_ENV!} mode on port ${process.env
      .PORT!}`
  )
);
