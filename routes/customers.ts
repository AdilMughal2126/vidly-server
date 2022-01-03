/* eslint-disable @typescript-eslint/no-misused-promises */
// file deepcode ignore Sqli: <please specify a reason of ignoring this>
import express, { Request, Response } from "express";
import { model, Schema } from "mongoose";
import Joi from "joi";
import { CustomerType, ParamsDictionary } from "./types";

const router = express.Router();

const Customer = model(
  "Customer",
  new Schema<CustomerType>({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
  })
);

const validateCustomer = (customer: CustomerType) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
};

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
      const customer = await Customer.create({
        name,
        phone,
        isGold,
      });
      return res.json(customer);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
);

router.put(
  "/:id",
  async (
    req: Request<ParamsDictionary, unknown, CustomerType>,
    res: Response
  ) => {
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
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json("Customer Not Found");

    const deleted = await Customer.deleteOne({ _id: req.params.id });

    return res.json(deleted);
  } catch (err) {
    return res.status(400).json(err);
  }
});

export { router as customers };
