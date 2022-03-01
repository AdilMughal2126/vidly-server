import express from "express";
import {
	handleDeleteBookmark,
	handleGetBookmarks,
	handlePostBookmark,
} from "../controllers/bookmarks";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.get("/", requireAuth, handleGetBookmarks);
router.post("/", requireAuth, handlePostBookmark);
router.delete("/:movieId/:userId", requireAuth, handleDeleteBookmark);

export { router as bookmarks };
