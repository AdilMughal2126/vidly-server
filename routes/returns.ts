import express from "express";
import { handleReturnedMovie, validateReturn } from "../controllers/returns";
import { requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();
router.post(
  "/",
  [requireAuth, validateRequest(validateReturn)],
  handleReturnedMovie
);

export { router as returns };
