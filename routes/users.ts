import express from "express";
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetUser,
  handleGetUsers,
  handleUpdateUser,
} from "../controllers/users";
import { requireAdmin } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";

const router = express.Router();
router.route("/").get(handleGetUsers);
router.get("/:id", validateId, handleGetUser);
router.route("/").post(handleCreateUser);
router.put("/:id", [validateId, requireAdmin], handleUpdateUser);
router.delete("/:id", [validateId, requireAdmin], handleDeleteUser);

export { router as users };
