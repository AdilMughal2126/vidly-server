/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import supertest from "supertest";
import mongoose from "mongoose";
import { app } from "../../../server";
import { User } from "../../../models/user";
import { Movie } from "../../../models/movie";
import { Rental } from "../../../models/rental";
import { Customer } from "../../../models/customer";
import { MovieType } from "../../../types/MovieType";
import { RentalType } from "../../../types/RentalType";
import { CustomerType } from "../../../types/CustomerType";
import { generateAuthToken } from "../../../helpers/auth";

const request = supertest(app);

describe("ROUTE /api/rentals", () => {
  let customer1: CustomerType;
  let customer2: CustomerType;
  let movie1: MovieType;
  let movie2: MovieType;

  afterEach(async () => await Rental.deleteMany({}));
  beforeEach(() => {
    customer1 = { name: "Takanome", phone: "771234567" };
    customer2 = { name: "Developer", phone: "771234567" };
    movie1 = {
      title: "Avengers",
      genre: { name: "Action" },
      numberInStock: 2,
      dailyRentalRate: 2.5,
    };
    movie2 = {
      title: "GAME OF THRONE",
      genre: { name: "Adventure" },
      numberInStock: 3,
      dailyRentalRate: 3.5,
    };
  });

  describe("GET /", () => {
    it("should return all the rentals", async () => {
      const rentals = [
        { customer: customer1, movie: movie1, rentalFee: 0 },
        { customer: customer2, movie: movie2, rentalFee: 0 },
      ];
      await Rental.create(rentals);
      const res = await request.get("/api/rentals");
      expect(res.status).toBe(200);
      expect(res.body[0].customer).toMatchObject(customer2);
      expect(res.body[1].customer).toMatchObject(customer1);
    });
  });

  describe("GET /:id", () => {
    let id: string;
    let rental: mongoose.Document<unknown, unknown, RentalType> & {
      _id: mongoose.Types.ObjectId;
    };

    beforeEach(async () => {
      rental = await Rental.create({
        customer: customer1,
        movie: movie1,
        rentalFee: 0,
      });
      id = rental._id.toHexString();
    });

    const exec = () => request.get(`/api/rentals/${id}`);

    it("should return 404 if ID is invalid", async () => {
      id = "1";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/invalid id/i);
    });

    it("should return 404 if rental is not found", async () => {
      id = "61df00dd7facff58c1a80e94";
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatch(/not found/i);
    });

    it("should return 200 if rental is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.customer).toHaveProperty("name", "Takanome");
      expect(res.body.movie).toHaveProperty("title", "Avengers");
    });
  });

  describe("POST /", () => {
    let customerId: string;
    let movieId: string;
    let token: string;

    afterEach(async () => {
      await Customer.deleteMany({});
      await Movie.deleteMany({});
    });

    beforeEach(async () => {
      const customer = await Customer.create(customer1);
      const movie = await Movie.create(movie1);
      movieId = movie._id as string;
      customerId = customer._id as string;
      token = generateAuthToken(new User());
    });

    const exec = () =>
      request
        .post("/api/rentals")
        .set("X-Auth-Token", token)
        .send({ customerId, movieId });

    it("should return 401 if no jwt was provided", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.body).toMatch(/access denied/i);
    });

    it("should return 400 if rental is invalid", async () => {
      customerId = "1";
      // movieId = "1";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/fails to match the ObjectId pattern/i);
    });

    it("should return 400 if customer is invalid", async () => {
      customerId = "61df00dd7facff58c1a80e94";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/invalid customer/i);
    });

    it("should return 400 if movie is invalid", async () => {
      movieId = "61df00dd7facff58c1a80e94";
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatch(/invalid movie/i);
    });

    // it("should return 404 if numberInStock is null", async () => {
    //   const res = await exec();
    //   expect(res.status).toBe(404);
    //   expect(res.body).toMatch(/no movie found/i);
    // });

    it("should return 200 if rental is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.customer).toMatchObject(customer1);
      expect(res.body.movie).toHaveProperty("title", "Avengers");
    });
  });
});
