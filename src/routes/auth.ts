import express from "express";
import { handleAuth, validateAuth } from "../controllers/auth";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();
router.post("/", validateRequest(validateAuth), handleAuth);

export { router as auth };
