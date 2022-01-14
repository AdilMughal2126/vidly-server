import mongoose from "mongoose";
import { Movie } from "../models/movie";
import { Rental } from "../models/rental";
import { Customer } from "../models/customer";
import { asyncMiddleware } from "../middleware/async";
import { NextFunction, Request, Response } from "express";
import { CustomerRental } from "../types/CustomerRentalType";

export const handleGetRentals = asyncMiddleware(
  async (req: Request, res: Response) => {
    const rentals = await Rental.find().sort("-dateOut");
    return res.json(rentals);
  }
);

export const handleGetRental = asyncMiddleware(
  async (req: Request, res: Response) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json("Rental Not Found");
    return res.json(rental);
  }
);

export const handleCreateRental = async (
  req: Request<unknown, unknown, CustomerRental>,
  res: Response,
  next: NextFunction
) => {
  const { customerId, movieId } = req.body;
  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(400).json("Invalid Customer");
  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).json("Invalid Movie");
  if (movie.numberInStock === 0) return res.status(404).json("No Movie Found");

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const rental = await Rental.create({
        customer: {
          _id: customer._id as string,
          name: customer.name,
          phone: customer.phone,
        },
        movie: {
          _id: movie._id as string,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
      });
      movie.numberInStock--;
      await movie.save();
      res.json(rental);
    });
    return void session.endSession();
  } catch (err) {
    return next(err);
  }
};
