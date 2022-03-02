import express from "express";
import {
	handleDeleteFavorite,
	handleDeleteFavorites,
	handleGetFavorites,
	handlePostFavorite,
} from "../controllers/favorites";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, handleGetFavorites);
router.post("/", requireAuth, handlePostFavorite);
router.delete("/:movieId/:userId", requireAuth, handleDeleteFavorite);
router.delete("/:userId", requireAuth, handleDeleteFavorites);

export { router as favorites };
