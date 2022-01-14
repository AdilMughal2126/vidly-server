import express from "express";
import {
  handleCreateMovie,
  handleDeleteMovie,
  handleGetMovie,
  handleGetMovies,
  handleUpdateMovie,
} from "../controllers/movies";
import { validateMovie } from "../models/movie";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();
router.route("/").get(handleGetMovies);
router.get("/:id", validateId, handleGetMovie);
router.post(
  "/",
  [requireAuth, validateRequest(validateMovie)],
  handleCreateMovie
);
router.put(
  "/:id",
  [validateId, requireAuth, validateRequest(validateMovie)],
  handleUpdateMovie
);
router.delete("/:id", [validateId, requireAdmin], handleDeleteMovie);

export { router as movies };
