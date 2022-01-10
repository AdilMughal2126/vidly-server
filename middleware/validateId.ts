import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).json("Invalid ID");
  return next();
};
