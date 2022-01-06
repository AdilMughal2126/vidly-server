import { NextFunction, Request, Response } from "express";
import { getToken, verifyToken } from "../helpers/auth";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getToken(req);
  if (!token) return res.status(401).json("Access denied. No token provided");

  try {
    verifyToken(token);
    return next();
    // if (req.params.id !== undefined) {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   const _id = Object.values(decoded).at(0);
    //   const isValid = _id === req.params.id;

    //   if (!isValid) return res.status(401).json("Unauthorized");
    // }
  } catch (err) {
    return res.status(400).json("Invalid token");
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getToken(req);
  if (!token) return res.status(401).json("Access denied. No token provided");

  try {
    const decoded = verifyToken(token);
    const isAdmin = Object.keys(decoded).includes("isAdmin");
    if (!isAdmin) return res.status(403).json("Access denied.");
    return next();
  } catch (err) {
    return res.status(400).json("Invalid token");
  }
};

// export const validateUserAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = getToken(req);
//   if (!token) return res.status(401).json("Access denied. No token provided");

//   try {
//     const decoded = verifyToken(token);

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const _id = Object.values(decoded).at(0);
//     const isValid = _id === req.params.id;

//     if (!isValid) return res.status(401).json("Unauthorized");

//     return next();
//   } catch (err) {
//     return res.status(400).json("Invalid token");
//   }
// };
