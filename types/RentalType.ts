import { CustomerType } from "./CustomerType";
import { MovieType } from "./MovieType";

export type RentalType = {
  customer: CustomerType;
  movie: Pick<MovieType, "title" | "dailyRentalRate">;
  dateOut: Date | { type: DateConstructor; default: () => number };
  dateReturned: Date;
  rentalFee: number;
};
