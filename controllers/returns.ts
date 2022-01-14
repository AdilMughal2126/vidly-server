import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Movie } from "../models/movie";
import { Rental } from "../models/rental";
import { CustomerRental } from "../types/CustomerRentalType";

export const handleReturnedMovie = async (
  req: Request<unknown, unknown, CustomerRental>,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { error } = validateReturn(req.body);
    // if (error) return res.status(400).json(error.details[0].message);

    const rental = await Rental.findOne({
      "customer._id": req.body.customerId,
      "movie._id": req.body.movieId,
    });

    if (!rental) return res.status(404).json("No rental was found");

    if (rental.dateReturned) return res.status(400).json("Already prossesses");

    rental.dateReturned = new Date();
    await rental.save();

    const day = 24 * 60 * 60 * 1000;
    const daysDiff = +rental.dateReturned - +rental.dateOut;

    /**
     * @ref https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
     */

    const numberOfDays = Math.round(daysDiff / day);

    rental.rentalFee = numberOfDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.findByIdAndUpdate(req.body.movieId, {
      $inc: { numberInStock: 1 },
    });

    return res.status(200).json(rental);
  } catch (err) {
    return next(err);
  }
};

export const validateReturn = (rental: CustomerRental) => {
  const schema = Joi.object({
    customerId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
      .required(),
    movieId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/, "ObjectId")
      .required(),
  });

  return schema.validate(rental);
};
