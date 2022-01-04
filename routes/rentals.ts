/* eslint-disable @typescript-eslint/no-misused-promises */
// file deepcode ignore Sqli: <please specify a reason of ignoring this>
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { Customer } from "../models/customer";
import { Movie } from "../models/movie";
import { Rental, validateRental } from "../models/rental";
import { CustomerRental } from "./types";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    return res.json(rentals);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json("rental Not Found");

    return res.json(rental);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post(
  "/",
  async (req: Request<unknown, unknown, CustomerRental>, res: Response) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { customerId, movieId } = req.body;

    try {
      const customer = await Customer.findById(customerId);
      if (!customer) return res.status(400).json("Invalid Customer");

      const movie = await Movie.findById(movieId);
      if (!movie) return res.status(400).json("Invalid Movie");

      if (movie.numberInStock === 0)
        return res.status(404).json("No Movie Found");

      const session = await mongoose.startSession();

      await session.withTransaction(async () => {
        const rental = await Rental.create({
          customer: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
          },
          movie: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            _id: movie._id,
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
      return res.status(400).json(err);
    }
  }
);

export { router as rentals };
