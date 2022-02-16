import express from "express";
import {
	// handleCreateMovie,
	handleDeleteMovie,
	handleGetMovie,
	handleGetMovies,
	// handleUpdateMovie,
} from "../controllers/movies";
// import { validateMovie } from "../models/movie";
import { validateId } from "../middleware/validateObjectId";
import { requireAdmin } from "../middleware/auth";
// import { requireAdmin, requireAuth } from "../middleware/auth";
// import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();
router.route("/").get(handleGetMovies);
router.get("/:id", validateId, handleGetMovie);
// router.post(
//   "/",
//   [requireAuth, validateRequest(validateMovie)],
//   handleCreateMovie
// );
// router.put(
//   "/:id",
//   [validateId, requireAuth, validateRequest(validateMovie)],
//   handleUpdateMovie
// );
router.delete("/:id", [validateId, requireAdmin], handleDeleteMovie);

export { router as movies };
