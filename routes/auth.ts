import express from "express";
import { handleAuth } from "../controllers/auth";

const router = express.Router();
router.route("/").post(handleAuth);

export { router as auth };
