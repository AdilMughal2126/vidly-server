import express from "express";
import {
	handleCreateUser,
	handleDeleteUser,
	handleGetUser,
	handleGetUsers,
	handleUpdatePassword,
	handleUpdateUser,
} from "../controllers/users";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateId";
import { validateRequest } from "../middleware/validateRequest";
import { validateUser } from "../models/user";

const router = express.Router();
router.get("/", requireAdmin, handleGetUsers);
router.get("/:id", [validateId, requireAdmin], handleGetUser);
router.post("/", validateRequest(validateUser), handleCreateUser);
router.put("/:id", [validateId, requireAuth], handleUpdateUser);
router.put("/reset/:id", [validateId, requireAuth], handleUpdatePassword);
router.delete("/:id", [validateId, requireAdmin], handleDeleteUser);

export { router as users };
