import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateRequest =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

    (validator: (req: any) => Joi.ValidationResult<unknown>) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { error } = validator(req.body);
      if (error) return res.status(400).json(error.details[0].message);
      return next();
    };
