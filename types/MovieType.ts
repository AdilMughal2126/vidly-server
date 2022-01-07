import { GenreType } from "./GenreType";

export type MovieType = {
  title: string;
  genre?: GenreType;
  genreId?: string;
  numberInStock: number;
  dailyRentalRate: number;
};
