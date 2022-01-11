import express from "express";
import {
  handleDeleteCustomer,
  handleGetCustomer,
  handleGetCustomers,
  handleCreateCustomer,
  handleUpdateCustomer,
} from "../controllers/customers";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";

const router = express.Router();
router.route("/").get(handleGetCustomers);
router.get("/:id", validateId, handleGetCustomer);
router.post("/", requireAuth, handleCreateCustomer);
router.put("/:id", [validateId, requireAuth], handleUpdateCustomer);
router.delete("/:id", [validateId, requireAdmin], handleDeleteCustomer);

export { router as customers };
