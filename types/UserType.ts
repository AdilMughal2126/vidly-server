export type UserType = {
  _id?: string;
  name?: string;
  email: string;
  password: string;
  hash?: string;
  isAdmin?: boolean;
};
