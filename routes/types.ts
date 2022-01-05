export type GenreType = {
  name: string;
};

export type Params = {
  [key: string]: string;
};

export type CustomerType = {
  name: string;
  phone: string;
  isGold: boolean;
};

export type MovieType = {
  title: string;
  genre?: GenreType;
  genreId?: string;
  numberInStock: number;
  dailyRentalRate: number;
};

type DateType = { type: DateConstructor; default: () => number };

export type RentalType = {
  customer: CustomerType;
  movie: Pick<MovieType, "title" | "dailyRentalRate">;
  dateOut: DateType;
  dateReturned: Date;
  rentalFee: number;
};

export type CustomerRental = {
  customerId: string;
  movieId: string;
};

export type UserType = {
  name?: string;
  email: string;
  password: string;
  hash?: string;
};
