/* eslint-disable @typescript-eslint/no-unsafe-assignment */

//* Middleware
import { asyncMiddleware } from "../middleware/async";
//* Model
import { Customer, validateCustomer } from "../models/customer";
//* Interfaces
import { Request, Response } from "express";
//* Types
import { CustomerType } from "../types/CustomerType";
import { Params } from "../types/ParamsType";

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
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    const { name, phone, isGold } = req.body;
    const customer = await Customer.create({ name, phone, isGold });
    return res.json(customer);
  }
);

export const handleUpdateCustomer = asyncMiddleware(
  async (req: Request<Params, unknown, CustomerType>, res: Response) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).json(error.details[0].message);
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
