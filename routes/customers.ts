import express from "express";
import {
  handleDeleteCustomer,
  handleGetCustomer,
  handleGetCustomers,
  handleCreateCustomer,
  handleUpdateCustomer,
} from "../controllers/customers";
import { validateCustomer } from "../models/customer";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateObjectId";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router();
router.route("/").get(handleGetCustomers);
router.get("/:id", validateId, handleGetCustomer);
router.post(
  "/",
  [requireAuth, validateRequest(validateCustomer)],
  handleCreateCustomer
);
router.put(
  "/:id",
  [validateId, requireAuth, validateRequest(validateCustomer)],
  handleUpdateCustomer
);
router.delete("/:id", [validateId, requireAdmin], handleDeleteCustomer);

export { router as customers };
