import express from "express";
import {
  handleCreateGenre,
  handleDeleteGenre,
  handleGetGenre,
  handleGetGenres,
  handleUpdateGenre,
} from "../controllers/genres";
import { validateGenre } from "../models/genre";
import { validateId } from "../middleware/validateObjectId";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";

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
