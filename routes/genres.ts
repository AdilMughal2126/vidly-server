import express from "express";
import {
  handleCreateGenre,
  handleDeleteGenre,
  handleGetGenre,
  handleGetGenres,
  handleUpdateGenre,
} from "../controllers/genres";
import { validateGenre } from "../models/genre";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";
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
