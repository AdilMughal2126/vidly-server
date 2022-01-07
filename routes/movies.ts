import express from "express";
//* Controller
import {
  handleCreateMovie,
  handleDeleteMovie,
  handleGetMovie,
  handleGetMovies,
  handleUpdateMovie,
} from "../controllers/movies";
//* Middleware
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = express.Router();

router.route("/").get(handleGetMovies);
router.route("/:id").get(handleGetMovie);
router.post("/", requireAuth, handleCreateMovie);
router.put("/:id", requireAuth, handleUpdateMovie);
router.delete("/:id", requireAdmin, handleDeleteMovie);

export { router as movies };
