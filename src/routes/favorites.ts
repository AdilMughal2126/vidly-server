import express from "express";
import {
	handleGetFavorites,
	handlePostFavorite,
	handleDeleteFavorite,
} from "../controllers/favorites";
import { requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";

const router = express.Router();

router.get("/", [validateId, requireAuth], handleGetFavorites);
router.post("/", requireAuth, handlePostFavorite);
router.delete("/:movieId/:userId", requireAuth, handleDeleteFavorite);

export { router as favorites };
