import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "../../../server";
import { User } from "../../../models/user";
import { Movie } from "../../../models/movie";
import { Rental } from "../../../models/rental";
import { MovieType } from "../../../types/MovieType";
import { RentalType } from "../../../types/RentalType";
import { generateAuthToken } from "../../../helpers/auth";

const request = supertest(app);

/**
 * @route /api/returns
 *
 * @method POST {customerId, movieId}
 * @access Private
 *
 * Return 401 if client is not logged in
 * Return 400 if customerId is not provided
 * Return 400 if movieId is not provided
 * Return 404 if no rental found
 * Return 400 if rental already process
 * Return 200 if valid request
 * Set the return date
 * Calculate the rental fee
 * Increase stock
 * Retrun the rental
 */

describe("Route /api/returns", () => {
  let rental: mongoose.Document<unknown, unknown, RentalType> &
    RentalType & {
      _id: mongoose.Types.ObjectId;
    };
  let movie: mongoose.Document<unknown, unknown, MovieType> &
    MovieType & {
      _id: mongoose.Types.ObjectId;
    };
  let token: string;
  let customerId: string;
  let movieId: string;

  beforeEach(async () => {
    token = generateAuthToken(new User());
    movieId = new mongoose.Types.ObjectId().toHexString();
    customerId = new mongoose.Types.ObjectId().toHexString();
    movie = await Movie.create({
      _id: movieId,
      title: "Avengers",
      dailyRentalRate: 2,
      genre: { name: "Action" },
      numberInStock: 5,
    });
    rental = await Rental.create({
      customer: {
        _id: customerId,
        name: "Takanome",
        phone: "77000000",
      },
      movie: {
        _id: movieId,
        title: "Avengers",
        dailyRentalRate: 2,
      },
    });
  });
  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  const exec = () =>
    request
      .post("/api/returns")
      .set("X-Auth-Token", token)
      .send({ customerId, movieId });

  it("should return 401 if no jwt was provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if no customerId was provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if no movieId was provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental was found", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental already process", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if input is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should record the date returned if input is valid", async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const dateReturned = rentalInDb?.dateReturned;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const diff = +new Date() - +dateReturned!;
    expect(diff).toBeLessThan(5 * 1000);
  });

  it("should calculate the rental fee if input is valid", async () => {
    rental.dateOut = new Date("1/12/2022");
    await rental.save();
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb?.rentalFee).toBe(6);
  });

  it("should increase the movie stock if input is valid", async () => {
    await exec();
    const movieInDb = await Movie.findById(movie._id);
    expect(movieInDb?.numberInStock).toBe(6);
  });

  it("should return the rental if input is valid", async () => {
    const properties = [
      "dateOut",
      "dateReturned",
      "rentalFee",
      "customer",
      "movie",
    ];
    const res = await exec();
    expect(Object.keys(res.body as object)).toEqual(
      expect.arrayContaining(properties)
    );
    // const res = await exec();
    // const rentalInDb = await Rental.findById(rental._id);
    // expect(res.body).toMatchObject(rentalInDb!);
  });
});
