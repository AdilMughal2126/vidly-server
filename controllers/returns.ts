import { NextFunction, Request, Response } from "express";
import { Rental } from "../models/rental";
import { CustomerRental } from "../types/CustomerRentalType";

export const handleReturnedMovie = async (
  req: Request<unknown, unknown, CustomerRental>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.customerId)
      return res.status(400).json("No customerId was provided");

    if (!req.body.movieId)
      return res.status(400).json("No movieId was provided");

    const rental = await Rental.findOne({
      "customer._id": req.body.customerId,
      "movie._id": req.body.movieId,
    });

    if (!rental) return res.status(404).json("No rental was found");

    if (rental.dateReturned) return res.status(400).json("Already prossesses");

    return res.status(401).json("access denied");
  } catch (err) {
    return next(err);
  }
};
