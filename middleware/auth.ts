/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("X-Auth-Token");
  if (!token) return res.status(401).json("Access denied. No token provided");

  try {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY!);
    return next();
  } catch (err) {
    return res.status(400).json("Invalid token");
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("X-Auth-Token");
  if (!token) return res.status(401).json("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!);
    const isAdmin = Object.keys(decoded).includes("isAdmin");

    if (!isAdmin) return res.status(403).json("Access denied.");

    return next();
  } catch (err) {
    return res.status(400).json("Invalid token");
  }
};

export const validateUserAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("X-Auth-Token");
  if (!token) return res.status(401).json("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!);

    const _id = Object.values(decoded)[0];
    const isValid = _id === req.params.id;

    if (!isValid) return res.status(401).json("Unauthorized");

    return next();
  } catch (err) {
    return res.status(400).json("Invalid token");
  }
};
