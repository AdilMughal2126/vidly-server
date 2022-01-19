import express from "express";
import { requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { handleReturnedMovie, validateReturn } from "../controllers/returns";

const router = express.Router();
router.post(
  "/",
  [requireAuth, validateRequest(validateReturn)],
  handleReturnedMovie
);

export { router as returns };
