import express from "express";
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetUser,
  handleGetUsers,
  handleUpdateUser,
} from "../controllers/users";
import { validateUser } from "../models/user";
import { requireAdmin } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();
router.route("/").get(handleGetUsers);
router.get("/:id", validateId, handleGetUser);
router.post("/", validateRequest(validateUser), handleCreateUser);
router.put(
  "/:id",
  [validateId, requireAdmin, validateRequest(validateUser)],
  handleUpdateUser
);
router.delete("/:id", [validateId, requireAdmin], handleDeleteUser);

export { router as users };
