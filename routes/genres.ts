import express from "express";
//* Controller
import {
  handleCreateGenre,
  handleDeleteGenre,
  handleGetGenre,
  handleGetGenres,
  handleUpdateGenre,
} from "../controllers/genres";
//* Middleware
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateId";

const router = express.Router();

router.route("/").get(handleGetGenres);
router.get("/:id", validateId, handleGetGenre);
router.post("/", requireAuth, handleCreateGenre);
router.put("/:id", [validateId, requireAuth], handleUpdateGenre);
router.delete("/:id", [validateId, requireAdmin], handleDeleteGenre);

export { router as genres };
