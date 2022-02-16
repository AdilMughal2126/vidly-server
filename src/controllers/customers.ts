import { Request, Response } from "express";
import { Params } from "../types/ParamsType";
import { Customer } from "../models/customer";
import { CustomerType } from "../types/CustomerType";
import { asyncMiddleware } from "../middleware/async";

export const handleGetCustomers = asyncMiddleware(
  async (req: Request, res: Response) => {
    const customers = await Customer.find().sort("name");
    return res.json(customers);
  }
);

export const handleGetCustomer = asyncMiddleware(
  async (req: Request, res: Response) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json("Customer Not Found");
    return res.json(customer);
  }
);

export const handleCreateCustomer = asyncMiddleware(
  async (req: Request<unknown, unknown, CustomerType>, res: Response) => {
    const { name, phone, isGold } = req.body;
    const customer = await Customer.create({ name, phone, isGold });
    return res.json(customer);
  }
);

export const handleUpdateCustomer = asyncMiddleware(
  async (req: Request<Params, unknown, CustomerType>, res: Response) => {
    const { name, phone, isGold } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, isGold },
      { new: true }
    );
    if (!customer) return res.status(404).json("Customer Not Found");
    return res.json(customer);
  }
);

export const handleDeleteCustomer = asyncMiddleware(
  async (req: Request, res: Response) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).json("Customer Not Found");
    return res.json(customer);
  }
);
