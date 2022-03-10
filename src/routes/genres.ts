import express from "express";
import {
  handleCreateGenre,
  handleDeleteGenre,
  handleGetGenre,
  handleGetGenres,
  handleUpdateGenre
} from "../controllers/genres";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateId";
import { validateRequest } from "../middleware/validateRequest";
import { validateGenre } from "../models/genre";

const router = express.Router();
router.route("/").get(handleGetGenres);
router.get("/:id", validateId, handleGetGenre);
router.post(
  "/",
  [requireAuth, validateRequest(validateGenre)],
  handleCreateGenre
);
router.put(
  "/:id",
  [validateId, requireAuth, validateRequest(validateGenre)],
  handleUpdateGenre
);
router.delete("/:id", [validateId, requireAdmin], handleDeleteGenre);

export { router as genres };
