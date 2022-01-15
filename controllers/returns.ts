import Joi from "joi";
import { Movie } from "../models/movie";
import { Rental } from "../models/rental";
import { Request, Response } from "express";
import { asyncMiddleware } from "../middleware/async";
import { CustomerRental } from "../types/CustomerRentalType";
import { numberOfDays } from "../helpers/numberOfDays";

export const handleReturnedMovie = asyncMiddleware(
  async (req: Request<unknown, unknown, CustomerRental>, res: Response) => {
    const { customerId, movieId } = req.body;
    const rental = await Rental.findOne({
      "customer._id": customerId,
      "movie._id": movieId,
    });
    if (!rental) return res.status(404).json("No rental was found");
    if (rental.dateReturned)
      return res.status(400).json("Rental already process");
    rental.dateReturned = new Date();
    const days = numberOfDays(+rental.dateReturned, +rental.dateOut);
    rental.rentalFee = days * rental.movie.dailyRentalRate;
    await rental.save();
    await Movie.findByIdAndUpdate(req.body.movieId, {
      $inc: { numberInStock: 1 },
    });
    return res.status(200).json(rental);
  }
);

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
