import express from "express";
//* Controller
import {
  handleDeleteCustomer,
  handleGetCustomer,
  handleGetCustomers,
  handleCreateCustomer,
  handleUpdateCustomer,
} from "../controllers/customers";
//* Middleware
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = express.Router();

router.route("/").get(handleGetCustomers);
router.route("/:id").get(handleGetCustomer);
router.post("/", requireAuth, handleCreateCustomer);
router.put("/:id", requireAuth, handleUpdateCustomer);
router.delete("/:id", requireAdmin, handleDeleteCustomer);

export { router as customers };
