import express from "express";
import {
	handleDeleteBookmark,
	handleDeleteBookmarks,
	handleGetBookmarks,
	handlePostBookmark,
} from "../controllers/bookmarks";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, handleGetBookmarks);
router.post("/", requireAuth, handlePostBookmark);
router.delete("/:movieId", requireAuth, handleDeleteBookmark);
router.delete("/clear", requireAuth, handleDeleteBookmarks);

export { router as bookmarks };
