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

const router = express.Router();

router.route("/").get(handleGetGenres);
router.route("/:id").get(handleGetGenre);
router.post("/", requireAuth, handleCreateGenre);
router.put("/:id", requireAuth, handleUpdateGenre);
router.delete("/:id", requireAdmin, handleDeleteGenre);

export { router as genres };
