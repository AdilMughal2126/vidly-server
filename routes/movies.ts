import express from "express";
import {
  handleCreateMovie,
  handleDeleteMovie,
  handleGetMovie,
  handleGetMovies,
  handleUpdateMovie,
} from "../controllers/movies";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";

const router = express.Router();
router.route("/").get(handleGetMovies);
router.get("/:id", validateId, handleGetMovie);
router.post("/", requireAuth, handleCreateMovie);
router.put("/:id", [validateId, requireAuth], handleUpdateMovie);
router.delete("/:id", [validateId, requireAdmin], handleDeleteMovie);

export { router as movies };
