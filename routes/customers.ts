/* eslint-disable @typescript-eslint/no-misused-promises */
// file deepcode ignore Sqli: <please specify a reason of ignoring this>
import express, { Request, Response } from "express";
import { Customer, validateCustomer } from "../models/customers";
import { CustomerType, Params } from "./types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findById({ _id: req.params.id });
    if (!customer) return res.status(404).json("Customer Not Found");

    return res.json(customer);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post(
  "/",
  async (req: Request<unknown, unknown, CustomerType>, res: Response) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { name, phone, isGold } = req.body;

    try {
      const customer = await Customer.create({ name, phone, isGold });

      return res.json(customer);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  async (req: Request<Params, unknown, CustomerType>, res: Response) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { name, phone, isGold } = req.body;

    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) return res.status(404).json("Customer Not Found");

      const updated = await Customer.updateOne(
        { _id: req.params.id },
        {
          name,
          phone,
          isGold,
        }
      );

      return res.json(updated);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    // const customer = await Customer.findByIdAndRemove(req.params.id);
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json("Customer Not Found");

    await Customer.deleteOne({ _id: req.params.id });

    return res.json(customer);
  } catch (err) {
    return res.status(400).json(err);
  }
});

export { router as customers };
