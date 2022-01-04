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
