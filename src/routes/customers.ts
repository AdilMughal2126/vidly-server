import express from "express";
import {
	handleCreateCustomer,
	handleDeleteCustomer,
	handleGetCustomer,
	handleGetCustomers,
	handleUpdateCustomer,
} from "../controllers/customers";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateId } from "../middleware/validateId";
import { validateRequest } from "../middleware/validateRequest";
import { validateCustomer } from "../models/customer";

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
