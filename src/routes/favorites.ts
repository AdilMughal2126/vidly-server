import express from "express";
import {
	handleDeleteFavorite,
	handleGetFavorites,
	handlePostFavorite,
} from "../controllers/favorites";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.route("/").get(handleGetFavorites);
// router.get("/", [requireAuth], handleGetFavorites);
router.post("/", requireAuth, handlePostFavorite);
router.delete("/:movieId/:userId", requireAuth, handleDeleteFavorite);

export { router as favorites };
