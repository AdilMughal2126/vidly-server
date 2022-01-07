import express from "express";
//* Controller
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetUser,
  handleGetUsers,
  handleUpdateUser,
} from "../controllers/users";
//* Middleware
import { requireAdmin } from "../middleware/auth";

const router = express.Router();

router.route("/").get(handleGetUsers);
router.route("/:id").get(handleGetUser);
router.route("/").post(handleCreateUser);
router.put("/:id", requireAdmin, handleUpdateUser);
router.delete("/:id", requireAdmin, handleDeleteUser);

export { router as users };
