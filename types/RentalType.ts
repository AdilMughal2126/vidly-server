import { CustomerType } from "./CustomerType";
import { MovieType } from "./MovieType";

type DateType = { type: DateConstructor; default: () => number };

export type RentalType = {
  customer: CustomerType;
  movie: Pick<MovieType, "title" | "dailyRentalRate">;
  dateOut: DateType;
  dateReturned: Date;
  rentalFee: number;
};
